// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db=cloud.database()
  let data = await  db.collection('user_book_word').where({
    '_openid': wxContext.OPENID,
    'bookid':event.bookid}).get()
  let wordParam="#"+event.word
  if(data.data.length === 0){
    db.collection('user_book_word').add({data:{
      _openid: wxContext.OPENID,
      querytime:new Date().toLocaleString(),
      bookid:event.bookid,
      [wordParam]:event.content,
      booktitle:event.booktitle,
     }}).then(res => {
       console.log(res)
     })
  }else{
    await db.collection('user_book_word').where({
      '_openid': wxContext.OPENID,
      'bookid':event.bookid,
    }).update({
      data: {
        [wordParam]: event.content,
        querytime:new Date().toLocaleString(),
        booktitle:event.booktitle,
      },
    })
  }
 return {
  status:"success",
}
}