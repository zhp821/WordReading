// 云函数入口文件
const cloud = require('wx-server-sdk')
const todoSave=[
  'username',
  'mobile',
  'address',
  'others',
]
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  param=todoSave[event.number]
  await db.collection('user').where({
    openid: wxContext.OPENID
  }).update({
    data: {
      [param]: event.text
    },
  })
  return {
    status:"success",
  }
}