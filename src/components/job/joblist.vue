<template>
    <div id="main">
        <!--固定的顶部-->
        <div class="main_fixed_top">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="1">日本影片</el-menu-item>
                <el-menu-item index="2">我的收藏</el-menu-item>
                <el-menu-item index="3">浏览记录</el-menu-item>
            </el-menu>
        </div>
        <!--列表-->


        <div class="job_content" id="japanList" ref="wrapper" v-if="tab===1">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.japanList.list" :key="index">
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

        <div class="job_content" id="japanFavorite" ref="wrapper" v-if="tab===2">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.japanFavorite.list" :key="index">
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

        <div class="job_content" id="japanHistory" ref="wrapper" v-if="tab===3">
            <ul
                    class="page-infinite-list job_lists"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="50"
            >
                <li v-for="(item,index) in tableData.japanHistory.list" :key="index">
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
                    japanList: [],
                    japanFavorite: [],
                    japanHistory: [],
                },
                listQuery: {
                    japanList: {
                        pageNum: 1,
                        pageSize: 10,
                        actorName: null,
                        videoName: null,
                        types: null,
                        videoType: 1
                    },
                    japanFavorite: {
                        type: 1,
                        level: '',
                        pageSize: 10,
                        pageNum: 1,
                        load: false
                    },
                    japanHistory: {
                        type: 1,
                        startTime: null,
                        endTime: null,
                        pageSize: 10,
                        pageNum: 1,
                        load: false
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
                switchForMore: false,
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

                if (this.tab === 1) {
                    this.loading = true;
                    this.noMore = false;
                    getPageList(this.listQuery.japanList).then(res => {
                        this.listQuery.japanList.pageNum = this.randomNum(1, res.PageInfo.pages);
                        if (this.tableData.japanList.length <= 0) {
                            this.tableData.japanList = res.PageInfo
                        } else {
                            this.tableData.japanList.list = this.tableData.japanList.list.concat(res.PageInfo.list)
                        }
                    })
                } else if (this.tab === 2 && this.listQuery.comicHistory.load) {
                    this.loading = true
                    this.noMore = false;
                    getList(this.listQuery.japanFavorite).then(res => {
                        if (res.pageNum >= res.pages) {
                            this.listQuery.japanFavorite.load = false;
                            this.listQuery.japanFavorite.pageNum = res.pageNum
                        } else {
                            this.listQuery.japanFavorite.pageNum = res.pageNum + 1;
                        }
                        if (this.tableData.japanFavorite.length <= 0) {
                            this.tableData.japanFavorite = res
                        } else {
                            this.tableData.japanFavorite.list = this.tableData.japanFavorite.list.concat(res.list)
                        }
                    })
                } else if (this.tab === 3 && this.listQuery.comicHistory.load) {
                    this.loading = true
                    this.noMore = false;
                    getHistory(this.listQuery.japanHistory).then(res => {
                        if (res.pageNum >= res.pages) {
                            this.listQuery.japanHistory.load = false;
                            this.listQuery.japanHistory.pageNum = res.pageNum
                        } else {
                            this.listQuery.japanHistory.pageNum = res.pageNum + 1;
                        }
                        if (this.tableData.japanHistory.length <= 0) {
                            this.tableData.japanHistory = res
                        } else {
                            this.tableData.japanHistory.list = this.tableData.japanHistory.list.concat(res.list)
                        }
                    })
                } else {
                    this.noMore = true;
                }
                this.loading = false
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
                var listQuery = sessionStorage.getItem('listQuery_japan_video')
                var refresh = sessionStorage.getItem('refresh_japan_video')
                if (listQuery !== null && refresh !== null && refresh === 'true') {
                    this.listQuery = JSON.parse(listQuery)
                }
                getPageList(this.listQuery.japanList).then(res => {
                    this.listQuery.japanList.pageNum = this.randomNum(1, res.PageInfo.pages);
                    this.tab = 1;
                    this.tableData.japanList = res.PageInfo
                })
            },
            getFavoriteList() {
                this.noMore = false;
                getList(this.listQuery.japanFavorite).then(res => {
                    if (res.pageNum >= res.pages) {
                        this.listQuery.japanFavorite.load = false;
                        this.listQuery.japanFavorite.pageNum = res.pageNum
                    } else {
                        this.listQuery.japanFavorite.pageNum = res.pageNum + 1;
                    }
                    this.tab = 2;
                    this.tableData.japanFavorite = res
                })
            },
            getHistoryList() {
                this.noMore = false;
                getHistory(this.listQuery.japanHistory).then(res => {
                    if (res.pageNum >= res.pages) {
                        this.listQuery.japanHistory.load = false;
                        this.listQuery.japanHistory.pageNum = res.pageNum
                    } else {
                        this.listQuery.japanHistory.pageNum = res.pageNum + 1;
                    }
                    this.tab = 3;
                    this.tableData.japanHistory = res
                })
            },

            handleCurrentChange(index) {
                this.listQuery.pageNum = index
                sessionStorage.setItem('refresh_japan_video', false)
                this.getPageList()
            },
            handleSizeChange(pageSize) {
                this.listQuery.pageSize = pageSize
                sessionStorage.setItem('refresh_japan_video', false)
                this.getPageList()
            },
            handleSelect(tab, event) {
                console.log(tab);
                this.tab = tab;
                if (this.tab === 1) {
                    this.getPageList();
                } else if (this.tab === 2) {
                    this.getFavoriteList();
                } else if (this.tab === 3) {
                    this.getHistoryList();
                } else if (this.tab === '1') {
                    this.getPageList();
                } else if (this.tab === '2') {
                    this.getFavoriteList();
                } else if (this.tab === '3') {
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
                sessionStorage.setItem('refresh_japan_video', false)
                this.getPageList()
            },
            getActor(actor) {
                event.stopPropagation()
                this.listQuery.actorName = actor
                this.listQuery.types = null
                sessionStorage.setItem('refresh_japan_video', false)
                this.getPageList()
            },
            jump(videoid) {
                sessionStorage.setItem('listQuery_japan_video', JSON.stringify(this.listQuery))
                sessionStorage.setItem('refresh_japan_video', true)
                sessionStorage.setItem("refresh_video_detail", true);
                sessionStorage.setItem("queryList", {id: videoid, type: 1});
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
            sessionStorage.setItem(
                "listQuery_japan_video",
                JSON.stringify(this.listQuery)
            );
            sessionStorage.setItem("refresh_japan_video", true);
            next()
        }
    }
</script>

<style lang="stylus" scoped></style>
