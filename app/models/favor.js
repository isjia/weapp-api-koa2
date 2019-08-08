require('module-alias/register');

const {
  sequelize
} = require('@core/db');
const {
  Sequelize,
  Model,
  Op,
} = require('sequelize');

const {
  DislikeException,
  LikeException,
} = require('@core/http-exception');

const { Art } = require('./art');

class Favor extends Model {
  static async like(art_id, type, uid) {
    // favor 中增加一条记录
    // classic 中 favNum +1 
    // 通过数据库事务保证2个操作同时执行，保证数据的一致性。
    // 关系型数据库的 ACID：原子性，一致性，隔离性，持久性
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      }
    })
    if (favor) {
      throw new LikeException();
    }

    // 注意这里必须有 return
    return sequelize.transaction(async t => {
      await Favor.create({
        art_id,
        type,
        uid,
      }, {
        transaction: t
      });

      const art = await Art.getData(art_id, type, false);
      await art.increment('fav_nums', {
        by: 1,
        transaction: t
      });
    })
  }

  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      }
    })
    if (!favor) {
      throw new DislikeException();
    }

    // 注意这里必须有 return
    return sequelize.transaction(async t => {
            await favor.destroy({
              force: true,
              transaction: t,
            });

            const art = await Art.getData(art_id, type, false);
            await art.decrement('fav_nums', {
              by: 1,
              transaction: t
            });
    })
  }

  static async userLikeIt(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid,
      }
    })
    if (favor) {
      return true;
    }
    else {
      return false;
    }
  }

  static async getMyClassicFavors(uid) {
    const favors = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
        }
      }
    });
    if (!favors) {
      throw new NotFoundException('没有找到收藏记录');
    }
    return await Art.getList(favors);
  }

  // 获取我喜欢的图书数量
  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid
      }
    })
    return count;
  }

  //获取图书点赞的数量和我的点赞状态
  static async getBookFavor(uid, bookId) {
    const favorNums = await Favor.count({
      where: {
        art_id: bookId,
        type: 400
      }
    })

    const myFavor = await Favor.findOne({
      where: {
        art_id: bookId,
        uid,
        type: 400
      }
    })
    
    return {
      fav_nums: favorNums,
      like_status: myFavor ? 1 : 0,
    }
  }
}

Favor.init({
  uid: Sequelize.INTEGER,
  art_id: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
}, {
  sequelize,
  tableName: 'favor',
});

module.exports = {
  Favor,
}
