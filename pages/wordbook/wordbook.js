// pages/wordbook/wordbook.js

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
    var title='请先选择....'
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
  test:function(e){
    console.log('test ->',e)
  }
})