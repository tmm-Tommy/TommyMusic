<template>
  <div class="main">
    <!-- 头部 -->
    <b-navbar toggleable="lg" id="nav">
      <b-container>
        <b-navbar-brand href="#" class="navText">
          <span>Tommy Music</span>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- 中间 -->
          <b-navbar-nav class="ml-auto container navContent">
            <el-tabs v-model="chNavTag" @tab-click="ChNavTagClick">
              <el-tab-pane label="音乐" name="music"></el-tab-pane>
              <el-tab-pane label="播放" name="play"></el-tab-pane>
              <el-tab-pane label name="third"></el-tab-pane>
            </el-tabs>
          </b-navbar-nav>
          <!-- 右边 -->
          <b-navbar-nav class="ml-auto navRight">
            <b-nav-form>
              <el-autocomplete
                class="inline-input mr-sm-2"
                v-model="searchValue"
                :fetch-suggestions="querySearch"
                placeholder="Search Music"
                size="sm"
                @keydown.enter.native="enterInput()"
              ></el-autocomplete>
              <!-- <b-form-input size="sm"></b-form-input> -->
              <el-button icon="el-icon-search" circle size="mini" @click="serchMusic"></el-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <!-- 中间 -->
    <!-- 路由 -->
    <!-- 路由占位符 -->
    <router-view @change_NavName="change_NavName($event)"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chNavTag: "music",
      searchValue: ""
    };
  },
  methods: {
    ChNavTagClick() {
      this.$router.replace("/" + this.chNavTag);
    },
    change_NavName(e) {
      //公共方法
      this.chNavTag = e;
    },
    serchMusic() {
      //搜索歌曲
      this.$toMusic.modeMusic.mode = 2; //设置模式为搜索
      this.$toMusic.modeMusic.value = this.searchValue; //设置模式为搜索
      if ((this.$route.path + "").indexOf("play") != -1) {
        //如果处于当搜索路由
        window.sessionStorage.setItem(
          "serchMusic",
          this.$toMusic.modeMusic.value
        ); //存入记录里
        this.$router.go(0);
      }
      this.$router.replace("/play");
    },
    querySearch(queryString, cd) {
      //输入框激活
      return cd([
        { value: "告白气球" },
        { value: "我们的歌" },
        { value: "桥边姑娘" },
        { value: "薛之谦" },
        { value: "许嵩" }
      ]);
    },
    enterInput() {
      this.serchMusic();
    }
  }
};
</script>
<style scoped lang="less">
.main {
  width: 100%;
  height: 80%;
}
#nav {
  width: 100%;
  height: 10%;
  background: rgb(255, 255, 255);
  box-shadow: 2px 2px 15px rgba(190, 188, 188, 0.63);
  opacity: 0.8;
}
/deep/.navbar-light .navbar-toggler {
  position: absolute;
  left: 80%;
  top: 10%;
}
.el-autocomplete {
  border-radius: 20px;
}
.navText span {
  color: rgb(160, 160, 160);
}
/* 头部中间 */
.navContent {
  width: 60%;
  height: 100%;
}
/* 右边 */
@media (max-width: 767px) {
  .navRight {
    padding-left: 25%;
    .el-button {
      margin-left: 40%;
      margin-top: 2%;
    }
  }
}
</style>
