// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = wx.cloud.database()
  console.log("&&&&&&&&&")
  let data = await new Promise((resolve)=>{
    db.collection('user').doc(wxContext.OPENID).get().then(res => {
      console.log(res.data)
    })   
  })
  if(data == undefined){
    data['_id']= wxContext.OPENID
    data['login_time']=new Date().getTime
    data['role']=0
    db.collection('user').add(data).then(res => {
      console.log(res)
    })
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    role:data['role'],
  }
}