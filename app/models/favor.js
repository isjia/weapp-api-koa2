const {
  sequelize
} = require('../../core/db');
const {
  Sequelize,
  Model
} = require('sequelize');

const {
  DislikeException,
  LikeException,
} = require('../../core/http-exception');

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

      const art = await Art.getData(art_id, type);
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

            const art = await Art.getData(art_id, type);
            await art.decrement('fav_nums', {
              by: 1,
              transaction: t
            });
    })
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