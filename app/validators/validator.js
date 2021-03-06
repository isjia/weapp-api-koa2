const {
  LinValidator,
  Rule
} = require('../../core/lin-validator-v2');

const {
  User
} = require('../models/user');

const { LoginType, ArtType } = require('../lib/enum');

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '需要的是正整数', {
        min: 1
      }),
      // 可以添加多条 rule，他们之间是 and 的关系
      // 'isEmail'
      // 或关系需要使用自定义规则
    ]
  }
}

// RegisterValidator
class RegisterValidator extends LinValidator {
  constructor() {
    super();

    this.email = [
      new Rule('isEmail', '不符合email规范')
    ];

    this.password1 = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', {
        min: 6,
        max: 32
      }),
      new Rule('matches', '密码必须包含特殊字符', '^.*(?=.*[!@#$%^&*?\(\)]).*$'), //来自：https://juejin.im/post/5aa23ee46fb9a028b86d9cf4
    ];

    this.password2 = this.password1;

    this.nickname = [
      new Rule('isLength', '昵称至少5个字符，最多32个字符', {
        min: 5,
        max: 32
      })
    ];
  }

  // 验证password 二次输入
  validatePassword(vals) {
    const pwd1 = vals.body.password1;
    const pwd2 = vals.body.password2;

    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同');
    }
  }
  
  // 验证 email 唯一
  async validateEmail(vals) {
    const email = vals.body.email;

    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (user) {
      throw Error('email 已存在');
    }
  }
}

// Token Validator
class TokenValidator extends LinValidator {
  constructor() {
    super();

    this.account = [
      new Rule('isLength', '账号长度为4-128个字符', {min: 4, max: 128})
    ]

    this.secret = [
      new Rule('isOptional'), //可以不填，比如小程序登录
      new Rule('isLength', '密码长度为6-128个字符', {
        min: 6,
        max: 128
      })
    ]
  }

  // 校验 login type
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('缺少 type 参数')
    }

    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type 参数不合法');
    }
  }
}

// Token not empty validator
class NotEmptyValidator extends LinValidator {
  constructor() {
    super();

    this.token = [
      new Rule('isLength', '不允许为空', {
        min: 1
      })
    ]
  }
}

// Like Validator
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
  }
}

// Classic Validator
class ArtValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '需要的是正整数', {
        min: 1
      }),
    ]
    this.type = [
      new Rule('isInt', '需要的是正整数', {
        min: 1
      }),
    ]
    this.validateType = checkArtType;
  }
}

// Search validator
class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [
      new Rule('isLength', '搜索关键词不能为空', {
        min: 1,
        max: 32,
      }),
    ]

    this.start = [
      new Rule('isInt', '参数不符合规范', {
        min: 0,
        max: 60000
      }),
      new Rule('isOptional', '', 0)
    ]

    this.count = [
      new Rule('isInt', '参数不符合规范', {
        min: 1,
        max: 20
      }),
      new Rule('isOptional', '', 20)
    ]
  }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '必须在1到12个字符之间', {
        min: 1,
        max: 12
      })
    ]
  }
}

function checkArtType(vals) {
  // const type = parseInt(vals.body.type || vals.path.type);
  const type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error('type是必须参数');
  }
  if (!ArtType.isThisType(type)) {
    throw new Error('type参数不合法');
  };
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ArtValidator,
  SearchValidator,
  AddShortCommentValidator,
}