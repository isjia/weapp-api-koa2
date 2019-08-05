require('module-alias/register');
const {
  flatten
 } = require('lodash');

const { Op } = require('sequelize');

const { Movie, Music, Sentence } = require('./classic');
const { ParameterException } = require('@core/http-exception');

class Art {
  constructor(art_id, type) {
    // 对象的特征作为类的属性，可以通过构造函数传入
    this.art_id = art_id;
    this.type = type;
  }

  get detail() {
    // art.detail 访问，不能传参
  }

  async getDetail(uid) {
    // art.getDetail() 访问
    const { Favor } = require('./favor');

    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new NotFoundException('没有找到期刊');
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    // art.setDataValue('like_status', like)
    // return art;
    return {
      art,
      like_status: like,
    }
  }

  static async getData(art_id, type, useScope = true) {
    const finder = {
      where: {
        id: art_id,
      }
    }
    let art = null;
    const scope = useScope ? 'bh': null;
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder);
        break;
      case 200:
        art = await Music.scope(scope).findOne(finder);
        break;
      case 300:
        art = await Sentence.scope(scope).findOne(finder);
        break;
      case 400:
        throw new ParameterException('无法获取图书信息');
        break;
      default:
        break;
    }
    return art;
  }

  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    }
    for (let artInfo of artInfoList) {
      // for...in for..of 的区别
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      if (artInfoObj[key].length === 0) {
        continue;
      }
      key = parseInt(key);
      arts.push(await Art._getListByType(artInfoObj[key], key));
    }
    return flatten(arts); //导入 lodash
  }

  static async _getListByType(ids, type) {
    let arts = [];
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        }
      }
    }
    const scope = 'bh';
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder);
        break;
      case 200:
        arts = await Music.scope(scope).findAll(finder);
        break;
      case 300:
        arts = await Sentence.scope(scope).findAll(finder);
        break;

      default:
        break;
    }
    return arts;
  }
}

module.exports = {
  Art,
}