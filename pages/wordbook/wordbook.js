// pages/wordbook/wordbook.js
const bookmgr = require('../../js/bookshelfMgr.js');
var bookMgr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo:null,
    bookword:{},
    title:'....'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    bookMgr = new bookmgr.bookshelfClass()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var bookid = wx.getStorageSync('bookid')
    console.log("**********->",bookid)
    var bookword={}
    var title='....'
    if (bookid != '') {
        this.getCloudWordList(bookid).then(res =>{
        if(res.length>0){
          bookword=res[0]
          title=bookword['booktitle']
          this.setData({
            systemInfo:wx.getSystemInfoSync(),
            title:title,
            bookword:bookword
          })
        }else{
          wx.showToast({
            title: '暂无生词...', //提示的内容
            duration: 2000, //持续的时间
            icon: 'success', //图标有success、error、loading、none四种
            mask: true //显示透明蒙层 防止触摸穿透
         })
        }
      })
      .catch(err =>{
        // .catch 返回报错信息
        console.log(err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
/**获取云端book word, 云数据库 */
getCloudWordList:async function(bookid) {
  const db = wx.cloud.database()
  var openid=wx.getStorageSync('openid')
  let data = await  db.collection('user_book_word').where({
   '_openid':openid,'bookid':bookid}).get()
  return data.data
 },
 changeWord:async function(e){
   _that=this
  booksList = bookMgr.getBooksInfo()
  item=[]
  ids=[]
  for (var i in booksList ){
    item.push(booksList[i]['title']+"-"+booksList[i]['id'])
    ids.push(booksList[i]['id'])
  }
  wx.showActionSheet({
    itemList:item, //文字数组
    success: (res) => {
     bookid=ids[res.tapIndex]
     wx.setStorage({
      key:'bookid',
      data:bookid
    })
     _that.onShow()
    },
    fail (res) {
    }
  })
 },
 shareWord:async function(e){
  var bookword=this.data.bookword
  var title=bookword['booktitle']
  var text=""
  var ukphone=""
  for (let key in bookword) {
    if (bookword.hasOwnProperty(key)&&key.startsWith("#")) { 
     if(bookword[key]['ukphone']){
      text=text+bookword[key]['word']+"["+bookword[key]['ukphone']+
       "]"+":"+bookword[key]['explain']
     }else{
      text=text+bookword[key]['word']+":"+bookword[key]['explain']
     }
     if(bookword[key]['exam_type']){
      text=text+"【"+bookword[key]['exam_type']+"】"
     }
     text=text+"\n"
    }
  }
   try {
     if(text.length<2){
       return
     }
     const res =  wx.getFileSystemManager().writeFileSync(
    `${wx.env.USER_DATA_PATH}/${title}-word.txt`,
    text,
    'utf8'
    )
    console.log(res)
    await wx.shareFileMessage({
      filePath: `${wx.env.USER_DATA_PATH}/${title}-word.txt`,
    })
   } catch(e) {
     console.error(e)
   }
},
  delWord:async function(e){
    var word=e.currentTarget.dataset.word
    var bookword=this.data.bookword
    var bookid=bookword['bookid'] 
    var _that=this
    wx.showModal({
      title: '删除操作', //提示的标题
      content: '警告:将从生词本中删除单词'+word ,//提示的内容
      success: async function(res) {
        if(res.confirm) {
          const db = wx.cloud.database()
          const _ = db.command
          var openid=wx.getStorageSync('openid')
          await  db.collection('user_book_word').where({
            '_openid':openid,'bookid':bookid}).update({
              data: {
                ['#'+word]: _.remove()
              },
            })
           delete bookword['#'+word]
           _that.setData({
            bookword:bookword
          })
          } else if (res.cancel) {
        }
      }
    })
  }
})