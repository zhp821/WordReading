// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  let role=0
  let data = await  db.collection('user').where({
    'openid': wxContext.OPENID}).get()
  if(data.data.length === 0){
    db.collection('user').add({data:{
     openid: wxContext.OPENID,
     logintime:new Date().toLocaleString(),
     role:0,
     unionid:wxContext.UNIONID,
    }}).then(res => {
      console.log(res)
    })
  }else{
    role=data.data[0]['role']
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    role:role,
  }
}