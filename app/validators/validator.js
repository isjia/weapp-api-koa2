const {
  LinValidator,
  Rule
} = require('../../core/lin-validator');

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

  // 规则校验
  validatePassword(vals) {
    const pwd1 = vals.body.password1;
    const pwd2 = vals.body.password2;

    if (pwd1 !== pwd2) {
      throw new Error('两个密码必须相同');
    }
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
}