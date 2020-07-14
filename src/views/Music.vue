<template>
  <div class="container" id="mainMusic">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item,index) in headImgs" :key="index">
        <el-image style="width: 100%; height: 100%" :src="item" fit="fill"></el-image>
      </el-carousel-item>
    </el-carousel>
    <span style="font-size:25px;">歌曲推荐</span>
    <div class="row musicCenter">
      <div
        class="col-md-2 musicList"
        v-for="(item,index) in dataMusicLists"
        :key="index"
        @click="PlayMusic(index)"
      >
        <img :src="item.image" />
        <div class="musicList_plays">
          <img src="@/assets/images/huo.png" />
          {{ item.playCount }}
        </div>
        <div class="musicList_playImg">
          <img src="http://cdnmusic.migu.cn/v3/static/img/common/default/btn-play.png" />
        </div>
        <div class="musicList_text">{{ item.playListName }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Home from "@/views/Home.vue";
export default {
  created() {
    this.getData();
  },
  data() {
    return {
      dataMusicLists: [],
      headImgs: [
        "http://cdnmusic.migu.cn/tycms_picture/20/04/119/200428145116688_1400x350_7497.jpg",
        "http://cdnmusic.migu.cn/tycms_picture/20/04/117/200426172050272_1400x350_4521.jpg",
        "http://cdnmusic.migu.cn/tycms_picture/20/05/122/200501122855251_1400x350_7444.jpg",
        "http://cdnmusic.migu.cn/tycms_picture/20/05/124/200503210304451_1400x350_423.jpeg"
      ]
    };
  },
  methods: {
    getData() {
      const load = this.loadAnimator();
      // 使用代理获取数据
      const data = this.$http.get(
        "playlist_bycolumnid_tag?playListType=2&type=1&columnId=15127315&startIndex=0"
      );
      data.then(r => {
        this.dataMusicLists = r.data.retMsg.playlist;
        load.close();
      });
    },
    PlayMusic(index) {
      this.$toMusic.modeMusic.mode = 1; //设置模式为歌单
      this.$toMusic.modeMusic.value = this.dataMusicLists[index].playListId; //设置模式为搜索
      this.$router.replace("/play");
    },
    loadAnimator() {
      //加载动画
      return this.$loading({
        lock: true,
        text: "正在提交请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
  }
};
</script>
<style scoped lang="less">
#mainMusic {
  margin-top: 1%;
}
@media (max-width: 767px) {
  #mainMusic {
    margin-top: 5%;
  }
}

@media (max-width: 767px) {
  /deep/ .el-carousel {
    z-index: -1;
  }
}

@media (max-width: 767px) {
  /deep/ .el-carousel__item,
  .el-carousel__mask {
    height: 80%;
  }
}
/deep/ .el-carousel__container {
  z-index: -1;
}
/deep/ .el-carousel__indicators--outside button {
  background-color: rgb(102, 177, 255);
}
@media (max-width: 767px) {
  /deep/ .el-carousel__item--card {
    width: 100%;
  }
}
.musicCenter {
  text-align: center;
}
.musicList {
  text-align: center;
  margin: 1%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    @media (max-width: 767px) {
      & {
        width: 60%;
        height: 80%;
      }
    }
  }
  .musicList_text {
    position: absolute;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    top: 85%;
    left: 25%;
    color: white;
    width: 50%;
    @media (max-width: 767px) {
      & {
        top: 67%;
        font-size: 15px;
      }
    }
  }
  .musicList_playImg {
    position: absolute;
    transition: 0.6s;
    opacity: 0;
    top: 32%;
    left: 32%;
    img {
      width: 100%;
      height: 100%;
    }
    &:hover {
      opacity: 1;
      cursor: pointer;
      transition: 0.6s;
    }
  }
  .musicList_plays {
    position: absolute;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    // border: 1px solid silver;
    top: 2%;
    left: 30%;
    width: 40%;
    border-radius: 20px;
    font-size: 13px;
    color: #fff;
    background: rgba(0, 0, 0, 0.253);
    img {
      width: 15%;
      height: 15%;
      margin-right: 5%;
    }
  }
}
</style>