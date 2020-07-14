<template>
  <div class="container">
    <!-- aplayer：音乐播放器
      float:是否浮动
    -->
    <div class="musicImg">
      <el-image :src="musicImg"></el-image>
    </div>
    <!-- 音乐播放器
          listMaxHeight="400"
    -->
    <aplayer
      ref="aplayer"
      :audio="audio"
      :lrcType="1"
      preload
      fixed
      :mini="false"
      @canplay="playMusic"
      autoplay
    />
  </div>
</template>
<script>
import Vue from "vue";
import APlayer from "@moefe/vue-aplayer";
Vue.use(APlayer, {
  defaultCover: "https://github.com/u3u.png",
  productionTip: true
});
export default {
  created() {
    // 初始化音乐播放器
    this.initMusic();
    this.getData();
  },
  data() {
    return {
      musicImg:
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=823774060,1665405604&fm=26&gp=0.jpg",
      lcys: [],
      audio: [],
      load: {}
    };
  },
  methods: {
    async getData() {
      this.load = this.loadAnimator(); //加载动画
      if (
        this.$toMusic.modeMusic.mode == 2 ||
        this.$toMusic.modeMusic.mode == 0
      ) {
        if (this.$toMusic.modeMusic.value == "") {
          let lastSerch = window.sessionStorage.getItem("serchMusic");
          if (lastSerch == "" || lastSerch == undefined) {
            this.$toMusic.modeMusic.value = "推荐";
            this.$toMusic.modeMusic.mode = 2;
          } else {
            this.$toMusic.modeMusic.value = lastSerch;
            this.$toMusic.modeMusic.mode = 2;
          }
        }
      } else {
        if (this.$toMusic.modeMusic.value == "") {
          let lastSerch = window.sessionStorage.getItem("modeMusic");
          if (lastSerch == "" || lastSerch == undefined) {
            this.$toMusic.modeMusic.value = "171013141";
            this.$toMusic.modeMusic.mode = 1;
          } else {
            this.$toMusic.modeMusic.value = lastSerch;
            this.$toMusic.modeMusic.mode = 1;
          }
        }
      }
      if (this.$toMusic.modeMusic.mode == 2) {
        window.sessionStorage.setItem(
          "serchMusic",
          this.$toMusic.modeMusic.value
        ); //存入上一次搜索的
        //搜索歌曲
        this.$http
          .get(
            "scr_search_tag?rows=20&type=2&keyword=" +
              this.$toMusic.modeMusic.value +
              "&pgc=1"
          )
          .then(r => {
            let dataMusics = r.data.musics;
            if (dataMusics != null && dataMusics.length != 0) {
              for (let i = 0; i < dataMusics.length; i++) {
                this.audio.push({
                  name: dataMusics[i].title,
                  artist: dataMusics[i].artist,
                  url: dataMusics[i].mp3,
                  cover: dataMusics[i].cover,
                  lrc: dataMusics[i].copyrightId
                });
              }
            } else {
              this.$message.warning("没有找到歌曲!");
            }
            // 关闭加载动画
            this.load.close();
            this.musicImg = dataMusics[0].cover;
            //获取了歌曲，但还没歌词，所以隐藏
            this.$refs.aplayer.hideLrc();
          });
      } else {
        window.sessionStorage.setItem(
          "modeMusic",
          this.$toMusic.modeMusic.value
        ); //存入上一次搜索的
        // 以歌单进入
        this.$http
          .get(
            "playlistcontents_query_tag?playListType=2&playListId=" +
              this.$toMusic.modeMusic.value +
              "&contentCount=38"
          )
          .then(r => {
            const plistMusic = r.data.contentList;
            for (let i = 0; i < plistMusic.length; i++) {
              this.audio.push({
                name: plistMusic[i].contentName,
                artist: plistMusic[i].singerName,
                musicId: plistMusic[0].contentId
              });
              this.$http
                .get(
                  'https://bird.ioliu.cn/v2/?headers=%7B"User-agent":"Android"%7D&url=http://m.music.migu.cn/migu/remoting/cms_detail_tag?pid=' +
                    plistMusic[i].contentId
                )
                .then(r => {
                  let musicData = r.data.data;
                  // 修改数据，并渲染
                  this.$set(this.audio[i], "url", musicData.listenUrl);
                  this.$set(this.audio[i], "cover", musicData.picL);
                  this.$set(this.audio[i], "lrc", musicData.lyricLrc);
                  this.$refs.aplayer.switch(1); // 切换到播放列表中的第二首歌
                  this.$refs.aplayer.switch(0); // 切换到播放列表中的第二首歌
                });
            }
          });
      }
    },
    initMusic() {
      this.$emit("change_NavName", "play");
    },
    // 播放监听
    playMusic() {
      // // 更换图片
      // 加载歌词
      this.dynView();
    },
    dynView() {
      this.$refs.aplayer.hideLrc();
      //加载歌词
      //获取正在播放的
      for (let i = 1; i < $("li").length; i++) {
        if ($($("li")[i]).attr("class") == "aplayer-list-light") {
          if (this.$toMusic.modeMusic.mode == 2) {
            let lrc = "";
            this.musicImg = this.audio[i - 1].cover; //加载图片
            if ((this.audio[i - 1].lrc + "").indexOf(":") == -1) {
              $.ajax({
                type: "get",
                url:
                  'https://bird.ioliu.cn/v2/?headers=%7B"User-agent":"Android"%7D&url=http://m.music.migu.cn/migu/remoting/cms_detail_tag?cpid=' +
                  this.audio[i - 1].lrc,
                cache: false,
                async: false,
                success: function(res) {
                  lrc = JSON.parse(res).data.lyricLrc;
                }
              });
              this.audio[i - 1].lrc = lrc;
              //获取歌曲后直接刷新歌词
              this.$refs.aplayer.showLrc();
            }
          } else if (this.$toMusic.modeMusic.mode == 1) {
            // 处理歌单进入后的歌词
            this.$http
              .get("scr_search_tag?rows=20&type=2&keyword=告白气球&pgc=1")
              .then(r => {
                // 借用访问接口拖延时间，再次加载歌词，以及播放歌曲
                this.$refs.aplayer.showLrc();
                this.$refs.aplayer.play();
                this.musicImg = this.audio[i - 1].cover; //加载图片
                this.load.close();
              });
          }
          break;
        }
      }
    },
    loadAnimator() {
      //加载动画
      return this.$loading({
        lock: true,
        text: "正在加载请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
  }
};
</script>
<style scoped lang="less">
.container {
  height: 110%;
  width: 100%;
  padding: 0;
  max-width: 100%;
}
.row {
  margin: 0;
}
.el-image {
  opacity: 0.2;
  width: 100%;
  height: 200%;
  max-height: 90%;
  max-width: 100%;
  position: absolute;
  z-index: -1;
}
.aplayer {
  background: rgba(255, 255, 255, 0);
}
/deep/ .aplayer.aplayer-fixed .aplayer-body {
  width: 100%;
  max-width: 100%;
  bottom: 10px;
}
/deep/ .aplayer.aplayer-fixed .aplayer-lrc {
  bottom: 15%;
  height: 70%;
  z-index: -1;
}
/deep/ .aplayer.aplayer-fixed .aplayer-list {
  margin-bottom: 80px;
  border: 0;
  background: white;
  @media (max-width: 767px) {
    & {
      width: 50%;
    }
  }
}
/deep/ .aplayer .aplayer-lrc p.aplayer-lrc-current {
  min-height: 20px;
  color: rgb(102, 177, 255);
}
/deep/ .aplayer .aplayer-lrc p {
  font-size: 15px;
  letter-spacing: 2px;
  color: #000;
  font-family: STKaiti, "华文楷体", sans-serif;
}
</style>