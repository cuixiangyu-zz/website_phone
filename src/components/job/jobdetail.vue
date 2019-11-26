<template>
    <div class="job_detial">
        <div class="job_detial_header">
            <router-link to="/home" class="flex_child"><span class="icon-left"></span></router-link>
            <h3>{{scrollInfo}}</h3>
            <!--<div>
                <el-dropdown style="width: 30%;left: 35%;height: 1.6rem">
                  <span class="el-dropdown-link" >
                    下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>-->
        </div>
        <div class="head-tab"  ref="wrapper">
            <ul class="clear">
                <li v-for="(item,index) in tableData" :key="item.res.name" @click="tabChange(item.res.name)">{{item.res.name}}<span class="icon-down"></span></li>
            </ul>

            <tableView ref="judge" :tabData="tabData1" :nowIndex="nowIndex" @hide="hide" @indexData="indexData" @btnSure="btnSure" v-show="showHide"></tableView>

        </div>
        <!---->
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
            <el-tab-pane
                    v-for="(item,index) in tableData"
                    :key="index"
                    :label="item.res.name"
                    :name="item.res.name"
            >
                <el-container>
                    <el-header></el-header>
                </el-container>
                <el-row type="flex">
                    <el-col>
                        <el-card>
                            <el-image :key="item.res.id" :src="item.res.coverUrl" :lazy="true" fit="fill"></el-image>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col>
                        <el-row style="bottom: 0px; top: 0px; right: 20px; left: 20px;">
                            <el-col :span="24" style="width: 88%;left: 6%">
                                <p style="font-size: 25px; ">{{item.res.name}}</p>
                            </el-col>
                            <el-col :span="24">
                                <div class="block">
                                    <span class="demonstration">评分</span>
                                    <el-rate v-model="item.res.level" :colors="colors"
                                             @change="changelevel(item.res)"></el-rate>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <p style="font-size: 17px; ">作者</p>
                                <el-col
                                        v-for="actor in item.res.actors"
                                        :span="4"
                                        :key="actor.id"
                                        class="row-li"
                                        @click="getActor(actor.id)"
                                >
                                    <el-tag>{{actor.chineseName}}</el-tag>
                                </el-col>
                            </el-col>
                            <el-col :span="24">
                                <p style="font-size: 17px; width: 20%;">分类</p>
                                <el-col
                                        v-for="type in item.res.types"
                                        :span="4"
                                        :key="type.id"
                                        class="row-li"
                                        @click="getType(type)"
                                >
                                    <el-tag>{{type.chineseName}}</el-tag>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

                <el-row style="width: 90%; left: 5%;" v-for="video in item.res.video" :key="video.poster">
                    <div class="player-container">
                        <video-player
                                class="vjs-custom-skin"
                                :options="video"
                                @keyup.left="down"
                                @keyup.right="up"
                        ></video-player>
                    </div>
                </el-row>
                <el-row style="width: 60%; left: 20%;"></el-row>
            </el-tab-pane>
        </el-tabs>
        <!--立即沟通-->
        <div class="will_chat">
            <router-link to="/message" class="flex_child"><span>立即沟通</span></router-link>
        </div>
    </div>
</template>

<script>
    import {getDetil, changelevel} from "@/api/videoDetail";
    // 引入video样式
    import "video.js/dist/video-js.css";
    import "vue-video-player/src/custom-theme.css";

    export default {
        name: 'detail',
        data() {
            return {
                scrollInfo: "职位详情",
                apiUrl: "",
                tempInfo: "",
                id: "",
                isSelected: false,
                // 匹配的新数据
                // 温馨提示都一样
                // 推荐职位
                recommend_jobs: [],
                tableData: [],
                querylist: [],
                editableTabsValue: "",
                video: undefined,
                listQuery: {
                    pageNum: 1,
                    pageSize: 10,
                    actorName: null,
                    pictureName: null,
                    language: null,
                    types: null
                },
                typeMap: "",
                actors: "",
                deviceDetail: null,
                imgSrc: "http://127.0.0.1:8081/website/resources/_MG_0138.jpg",
                url: "http://127.0.0.1:8081/website/resources/_MG_0138.jpg",
                level: {
                    id: null,
                    level: null
                },
                colors: ['#99A9BF', '#F7BA2A', '#FF9900']
            }
        },
        watch: {
            '$route': 'fecthIndex'
        },
        computed: {},
        methods: {
            // 返回上一次路由
            // goBack(){
            //   this.$router.back();
            // },
            willscroll() {
                //2.1 使用定时器，防止频繁滚动
                if (window.scrollTime) {
                    window.clearTimeout(window.scrollTime);
                }
                //2.2 定时器
                window.scrollTime = window.setTimeout(() => {
                    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    this.scrollInfo = (scrollTop > 30) ? this.need_job : "职位详情";
                    // console.log(scrollTop);
                }, 100);
            },
            toggleMore() {
                this.isMore = !this.isMore;
            },
            toggleSelect() {
                this.isSelected = !this.isSelected;
            },
            getDetil() {
                var listQuery = sessionStorage.getItem("listQuery_video_detail");
                var refresh = sessionStorage.getItem("refresh_video_detail");
                if (listQuery !== null && refresh !== null && refresh === "true") {
                    this.querylist = JSON.parse(listQuery);
                }
                if (
                    this.$route.params.id !== null &&
                    this.$route.params.id !== undefined &&
                    this.$route.params.id !== ""
                ) {
                    this.querylist.push(this.$route.params.id);
                }

                for (var i = 0; i < this.querylist.length; i++) {
                    var srcList = []
                    getDetil({id: this.querylist[i]}).then(res => {
                        for (const i of res.address) {
                            const videoinfo = {
                                playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                                autoplay: false, // 如果true,浏览器准备好时开始回放。
                                controls: true, // 控制条
                                preload: "auto", // 视频预加载
                                muted: false, // 默认情况下将会消除任何音频。
                                loop: false, // 导致视频一结束就重新开始。
                                language: "zh-CN",
                                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                                sources: [
                                    {
                                        src: i
                                    }
                                ],
                                poster: res.coverUrl,
                                width: document.documentElement.clientWidth,
                                notSupportedMessage: "此视频暂无法播放，请稍后再试" // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                            };
                            srcList.push(videoinfo);
                        }
                        res.video = srcList
                        this.tableData.push({res});

                        if (
                            this.$route.params.id !== null &&
                            this.$route.params.id !== undefined &&
                            this.$route.params.id !== "" &&
                            this.$route.params.id === res.id
                        ) {
                            this.editableTabsValue = res.name;
                        }
                    });
                }
                console.log(this.tableData);
            },
            getType(type) {
                event.stopPropagation();
                const arr = [];
                const arr1 = [];
                arr.push("allTypes");
                arr.push(type.id);
                arr1.push(arr);
                this.listQuery.types = arr1;
                this.listQuery.actorName = null;
                console.log(this.listQuery);
                this.jump();
            },
            getActor(actor) {
                event.stopPropagation();
                this.listQuery.actorName = actor;
                this.listQuery.types = null;
                this.jump();
            },
            jump() {
                this.$router.push({
                    path: "/video/index",
                    name: "影片" // 要跳转的路径的 name,可
                });
            },
            showimg() {
                const arr = [];
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0170.jpg");
                arr.push("http://127.0.0.1:8081/website/resources/_MG_0177.jpg");
                this.srcList = arr;
            },
            up() {
                var time = this.video.currentTime;
                console.log(time);
                this.video.currentTime = time + 120;
            },
            down() {
                var time = this.video.currentTime;
                console.log(time);
                this.video.currentTime = time - 120;
            },
            changelevel(item) {
                this.level.id = item.id;
                changelevel(this.level);
            },

        },
        // 創建后挂载到root之后调用该钩子函数
        mounted() {
            window.addEventListener("scroll", this.willscroll);
            this.video = this.$refs.video;
        },
        // 该实例被创建还没挂载root之前，ajax可以在这里
        created() {
            this.getDetil();
        },
        beforeRouteLeave(to, form, next) {
            sessionStorage.setItem(
                "listQuery_video_detail",
                JSON.stringify(this.querylist)
            );
            sessionStorage.setItem("refresh_video_detail", true);
            next();
        },
        hide() {
            this.showHide = false;
        },
        indexData() {
            this.nowIndex = [0];
            //			var title=this.titleData[this.tableIndex].title;
            //			this.titleData[this.tableIndex].title=title.replace(/[^\u4e00-\u9fa5]+/,"")+"("+number+")";
        },
        btnSure(number, indexData) {
            this.indexSub[this.tableIndex] = indexData;
            let title = this.titleData[this.tableIndex].title;
            if (number != 0) {
                this.titleData[this.tableIndex].title =
                    title.replace(/[^\u4e00-\u9fa5]+/, "") + "(" + number + ")";
            } else {
                this.titleData[this.tableIndex].title = title.replace(
                    /[^\u4e00-\u9fa5]+/,
                    ""
                );
            }

            this.showHide = false;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
