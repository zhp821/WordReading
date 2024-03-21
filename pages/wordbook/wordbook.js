// pages/wordbook/wordbook.js

/**获取云端book word, 云数据库 */
async function getCloudWordList(bookid) {
 const db = wx.cloud.database()
 var openid=wx.getStorageSync('openid')
 console.log("*******查询条件****->",openid+"$$"+bookid)
 let data = await  db.collection('user_book_word').where({
  '_openid':openid,'bookid':bookid}).get()
 return data.data
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo:null,
    bookword:{},
    title:'请先选择...'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookid = wx.getStorageSync('bookid')
    var bookword={}
    var title='请先选择...'
    if (bookid != '') {
      bookword= getCloudWordList(bookid)
      console.log('bookword ->', bookword)
      if(bookword.length>0){
        title=bookword['booktitle']
      }else{
        bookword={}
      }
    }
    this.setData({
      systemInfo:wx.getSystemInfoSync(),
      title:title,
      bookword:bookword
    })
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

  test:function(e){
    console.log('test ->',e)
  }
})