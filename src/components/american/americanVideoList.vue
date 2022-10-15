<template>
    <div id="main">
        <!--固定的顶部-->
        <div class="main_fixed_top">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="1">美国影片</el-menu-item>
                <el-menu-item index="2">我的收藏</el-menu-item>
                <el-menu-item index="3">浏览记录</el-menu-item>
            </el-menu>
        </div>
        <!--列表-->


        <div class="job_content" id="americanList" ref="wrapper" v-if="tab===1">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.americanList.list" :key="index">
                    <router-link
                            @click="changeDetialId(index)"
                            :to="{ name: 'detail', params: { id: item.id }}"
                    >
                        <img :src="item.coverUrl"/>
                        <h4 class="clear">{{item.name}}</h4>
                        <p class="clear">
                            <span></span>
                            <span class="tag-group__title">演员:</span>
                            <el-tag
                                    v-for="actor in item.actors"
                                    :key="actor.id"
                                    size="mini"
                                    effect="plain"
                                    @click="getType(types)"

                            >{{ actor.chineseName }}
                            </el-tag>
                        </p>
                    </router-link>
                </li>
            </ul>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
        </div>

        <div class="job_content" id="americanFavorite" ref="wrapper" v-if="tab===2">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.americanFavorite.list" :key="index">
                    <router-link
                            @click="changeDetialId(index)"
                            :to="{ name: 'detail', params: { id: item.video.id }}"
                    >
                        <img :src="item.video.coverUrl"/>
                        <h4 class="clear">{{item.video.name}}</h4>
                        <p class="clear">
                            <span></span>
                            <span class="tag-group__title">演员:</span>
                            <el-tag
                                    v-for="actor in item.video.actors"
                                    :key="actor.id"
                                    size="mini"
                                    effect="plain"
                                    @click="getType(types)"

                            >{{ actor.chineseName }}
                            </el-tag>
                        </p>
                    </router-link>
                </li>
            </ul>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
        </div>

        <div class="job_content" id="americanHistory" ref="wrapper" v-if="tab===3">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.americanHistory.list" :key="index">
                    <router-link
                            @click="changeDetialId(index)"
                            :to="{ name: 'detail', params: { id: item.video.id }}"
                    >
                        <img :src="item.video.coverUrl"/>
                        <h4 class="clear">{{item.video.name}}</h4>
                        <p class="clear">
                            <span></span>
                            <span class="tag-group__title">演员:</span>
                            <el-tag
                                    v-for="actor in item.video.actors"
                                    :key="actor.id"
                                    size="mini"
                                    effect="plain"
                                    @click="getType(types)"

                            >{{ actor.chineseName }}
                            </el-tag>
                        </p>
                    </router-link>
                </li>
            </ul>
            <div v-show="loading" class="page-infinite-loading">
                <mt-spinner type="fading-circle"></mt-spinner>
                客官您滑慢点...
            </div>
            <div v-show="noMore" class="page-infinite-loading">
                暂无更多...
            </div>
        </div>
        <!--返回顶部-->
        <!-- <img v-show="willshow" @click="gotop" src="/static/images/backTop.png" class="backTop" alt=""> -->
    </div>
</template>

<script>
    // 推荐子组件
    import slideTabComp from './slideTabComp.vue'
    // 城市选择组件
    import selectCityComp from './selectCityComp.vue'
    // 公司和要求公用一个子组件
    import compRequireComp from './compRequireComp.vue'

    import {getPageList} from '@/api/video'
    import {
        getHistory
    } from '@/api/viewHistory'
    import {
        getList
    } from '@/api/userFavorite'

    export default {
        name: "americanVideoList",
        data() {
            return {
                noMore: false,
                willshow: false,
                timer: null,
                mainscroll: null,
                apiUrl: '',
                jobs: [],
                temp: [],
                jobId: '',
                loading: false,
                allLoaded: false,
                wrapperHeight: 0,
                tableData: {
                    americanList: [],
                    americanFavorite: [],
                    americanHistory: [],
                },
                listQuery: {
                    americanList: {
                        pageNum: 1,
                        pageSize: 10,
                        actorName: null,
                        videoName: null,
                        types: null,
                        videoType: 2,
                        currentPage: 1
                    },
                    americanFavorite: {
                        type: 2,
                        level: '',
                        pageSize: 10,
                        pageNum: 1,
                        load : false
                    },
                    americanHistory: {
                        type: 2,
                        startTime: null,
                        endTime: null,
                        pageSize: 10,
                        pageNum: 1,
                        load : false
                    }
                },
                typeMap: '',
                actors: '',
                deviceDetail: null,
                imgSrc: 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                url: 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                srcList: [
                    // 'http://127.0.0.1:8081/website/resources/_MG_0170.jpg',
                    // 'http://127.0.0.1:8081/website/resources/_MG_0177.jpg'
                ],
                activeName: '',
                activeIndex: '1',
                tab: 1,
            }
        },
        components: {
            slideTabComp,
            selectCityComp,
            compRequireComp
        },
        computed: {},
        methods: {
            // 3、接收子传来的选项
            fromChild(msg) {
                this.navlist[0].title = msg
                // console.log(msg);
            },
            ///4、接收子传来的是否隐藏
            hide() {
                // this.isShowSlide=false;
                this.navlist.filter(value => {
                    value.isSelected = false
                })
            },
            // 5、切换的时候动态改变要传递到子组件的数据：this.slideTemp
            changeColor(nav, index) {
                let _this = this
                this.slideIndex = index
                this.slideTemp = this.slideData[index]
                if (nav.isSelected) {
                    nav.isSelected = false
                } else {
                    // 先清空所有选中效果
                    this.navlist.filter(value => {
                        value.isSelected = false
                    })
                    // 设置当前选中效果
                    nav.isSelected = true
                }
                // console.log(this.slideIndex);
            },
            willscroll() {
                //2.1 使用定时器，防止频繁滚动
                if (window.scrollTime) {
                    window.clearTimeout(window.scrollTime)
                }
                //2.2 定时器
                window.scrollTime = window.setTimeout(() => {
                    const scrollTop =
                        document.documentElement.scrollTop ||
                        window.pageYOffset ||
                        document.body.scrollTop
                    this.willshow = scrollTop > 300 ? true : false
                    // console.log("滚动了");
                }, 100)
            },
            //3 返回顶部
            gotop() {
                this.willshow = !this.willshow
                let d = document.documentElement
                let b = document.body
                // console.log(this.timer,d,b);
                this.timer = window.setInterval(() => {
                    d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
                    b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1)
                    //到达顶部清除定时器，重新绑定滚动事件
                    if (d.scrollTop + b.scrollTop === 0)
                        clearInterval(this.timer, (window.onscroll = this.willscroll))
                }, 10)
            },
            loadData() {
                let _this = this
                this.$http
                    .get(_this.apiUrl)
                    .then(response => {
                        if (response.data.code == '0') {
                            _this.jobs = response.data.main
                            // 模擬每次下拉加載的10條假數據
                            _this.temp = response.data.main
                            // console.log(response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            // 模擬無限下拉加載
            loadMore() {
              if(this.loading === true||this.noMore===true){
                return;
              }
                if(this.tab===1){
                    this.loading = true;
                    this.noMore = false;
                    getPageList(this.listQuery.americanList).then(res => {
                      this.listQuery.americanList.currentPage = this.listQuery.americanList.pageNum;
                        this.listQuery.americanList.pageNum = this.randomNum(1, res.PageInfo.pages);
                        if (this.tableData.americanList.length <= 0) {
                            this.tableData.americanList = res.PageInfo
                        } else {
                            this.tableData.americanList.list = this.tableData.americanList.list.concat(res.PageInfo.list)
                        }
                      this.loading = false;
                    })
                }else if(this.tab===2&&this.listQuery.americanFavorite.load){
                    this.loading = true;
                    this.noMore = false;
                    getList(this.listQuery.americanFavorite).then(res => {
                        if(res.pageNum>=res.pages){
                            this.listQuery.americanFavorite.load = false;
                        }else{
                            this.listQuery.americanFavorite.pageNum = res.pageNum+1;
                        }
                        if (this.tableData.americanFavorite.length <= 0) {
                            this.tableData.americanFavorite = res
                        } else {
                            this.tableData.americanFavorite.list = this.tableData.americanFavorite.list.concat(res.list)
                        }
                      this.loading = false;
                    })
                }else if(this.tab===3&&this.listQuery.americanHistory.load){
                    this.loading = true;
                    this.noMore = false;
                    getHistory(this.listQuery.americanHistory).then(res => {
                        if(res.pageNum>=res.pages){
                            this.listQuery.americanHistory.load = false;
                        }else{
                            this.listQuery.americanHistory.pageNum = res.pageNum+1;
                        }
                        if (this.tableData.americanHistory.length <= 0) {
                            this.tableData.americanHistory = res
                        } else {
                            this.tableData.americanHistory.list = this.tableData.americanHistory.list.concat(res.list)
                        }
                      this.loading = false;
                    })
                }else {
                    this.noMore = true;
                  this.loading = false
                }

            },
            // 4.1、阻止局部滚动到达边界后会造成页面继续滚动(不合适)
            stopScroll() {
                let container = document.getElementById('jobcontent')
                // console.log(container);
                container.addEventListener(
                    'touchmove',
                    function (event) {
                        event.preventDefault()
                    },
                    false
                )
            },
            // 4、2把阻止事件remove
            removeStopScroll() {
                let container = document.getElementById('jobcontent')
                container.removeEventListener(
                    'touchmove',
                    function (event) {
                        event.preventDefault()
                    },
                    false
                )
            },
            getPageList() {
                this.noMore = false;
                var listQuery = sessionStorage.getItem('listQuery_american_video')
                var refresh = sessionStorage.getItem('refresh_american_video')
                if (listQuery !== null && refresh !== null && refresh === 'true') {
                    this.listQuery = JSON.parse(listQuery)
                }
              this.listQuery.americanList.pageNum = this.listQuery.americanList.currentPage;
                getPageList(this.listQuery.americanList).then(res => {
                    this.listQuery.americanList.pageNum = this.randomNum(1, res.PageInfo.pages);
                    this.tab = 1;
                    this.tableData.americanList = res.PageInfo
                })
            },
            getFavoriteList() {
                this.noMore = false;
                getList(this.listQuery.americanFavorite).then(res => {
                    if (res.pageNum >= res.pages) {
                        this.listQuery.americanFavorite.load = false;
                        this.listQuery.americanFavorite.pageNum = res.pageNum
                    } else {
                        this.listQuery.americanFavorite.pageNum = res.pageNum + 1;
                    }
                    this.tab = 2;
                    this.tableData.americanFavorite = res
                })
            },
            getHistoryList() {
                this.noMore = false;
                getHistory(this.listQuery.americanHistory).then(res => {
                    if (res.pageNum >= res.pages) {
                        this.listQuery.americanHistory.load = false;
                        this.listQuery.americanHistory.pageNum = res.pageNum
                    } else {
                        this.listQuery.americanHistory.pageNum = res.pageNum + 1;
                    }
                    this.tab = 3;
                    this.tableData.americanHistory = res
                })
            },

            handleCurrentChange(index) {
                this.listQuery.pageNum = index
                sessionStorage.setItem('refresh_american_video', false)
                this.getPageList()
            },
            handleSizeChange(pageSize) {
                this.listQuery.pageSize = pageSize
                sessionStorage.setItem('refresh_american_video', false)
                this.getPageList()
            },
            handleSelect(tab, event) {
                console.log(tab);
                this.tab = tab;
                if(this.tab===1){
                    this.getPageList();
                }else if(this.tab===2){
                    this.getFavoriteList();
                }else if(this.tab===3){
                    this.getHistoryList();
                }else if(this.tab==='1'){
                    this.getPageList();
                }else if(this.tab==='2'){
                    this.getFavoriteList();
                }else if(this.tab==='3'){
                    this.getHistoryList();
                }
            },
            getType(type) {
                event.stopPropagation()
                const arr = []
                const arr1 = []
                arr.push('allTypes')
                arr.push(type.id)
                arr1.push(arr)
                this.listQuery.types = arr1
                this.listQuery.actorName = null
                console.log(this.listQuery)
                sessionStorage.setItem('refresh_american_video', false)
                this.getPageList()
            },
            getActor(actor) {
                event.stopPropagation()
                this.listQuery.actorName = actor
                this.listQuery.types = null
                sessionStorage.setItem('refresh_american_video', false)
                this.getPageList()
            },
            jump(videoid) {
              this.listQuery.americanList.pageNum = this.listQuery.americanList.currentPage;
                sessionStorage.setItem('listQuery_american_video', JSON.stringify(this.listQuery))
                sessionStorage.setItem('refresh_american_video', true)
                sessionStorage.setItem("refresh_video_detail", true);
                sessionStorage.setItem("queryList", {id: videoid, type: 2});
                this.$router.push({
                    path: '/video_detail/index',
                    name: 'jobdetail', // 要跳转的路径的 name,可在 router 文件夹下的 index.js 文件内找
                    params: {id: videoid}
                })
            },
            showimg() {
                const arr = []
                arr.push('http://127.0.0.1:8081/website/resources/_MG_0177.jpg')
                arr.push('http://127.0.0.1:8081/website/resources/_MG_0170.jpg')
                this.srcList = arr
            },
            randomNum(minNum, maxNum) {
                switch (arguments.length) {
                    case 1:
                        return parseInt(Math.random() * minNum + 1, 10);
                        break;
                    case 2:
                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                        break;
                    default:
                        return 0;
                        break;
                }
            }

        },
        mounted() {
            // 去掉范湖底部事件监听
            // window.addEventListener("scroll", this.willscroll);
            this.wrapperHeight =
                document.documentElement.clientHeight -
                this.$refs.wrapper.getBoundingClientRect().top
            // console.log(this.$refs.wrapper.getBoundingClientRect().top);
        },
        created() {
            this.getPageList()
        },
        beforeRouteLeave(to, form, next) {
            this.listQuery.americanFavorite.pageNum = 1;
            this.listQuery.americanHistory.pageNum = 1;
          this.listQuery.americanList.pageNum = this.listQuery.americanList.currentPage;
            sessionStorage.setItem(
                "listQuery_american_video",
                JSON.stringify(this.listQuery)
            );
            sessionStorage.setItem("refresh_american_video", true);
            next()
        }
    }
</script>

<style lang="stylus" scoped></style>
