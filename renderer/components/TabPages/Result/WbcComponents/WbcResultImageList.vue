<template>
  <b-container id="wbcResultImageList" fluid @keyup="onKeyUp">
    <b-row>
      <b-col cols="3" class="ml-4">
        <b-form-checkbox v-model="isMarker" switch size="lg" @change="onChangeMarker">
          Cell marking
        </b-form-checkbox>
      </b-col>
      <b-col>
        <b-row>
          <!-- size -->
          <b-col cols="1">
            <img id="popoverSize" class="pointer mt-1 ml-3" src="~@/assets/result/size.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverSize"
              placement="bottom"
              title="Size"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="sliderValue"
                @drag-start="onSliderDragStart"
                @drag-end="onSliderDragEnd"
                :min="30"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>

          <!-- brightness -->
          <b-col cols="1">
            <img id="popoverBrightness" class="pointer mt-1 ml-3" src="~@/assets/result/brightness.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverBrightness"
              placement="bottom"
              title="Brightness"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="brightnessValue"
                :min="80"
                :max="150"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>

          <!-- RGB -->
          <b-col cols="1">
            <img id="popoverRGB" class="pointer mt-1 ml-3" src="~@/assets/result/rgb.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverRGB"
              placement="bottom"
              title="RGB"
              triggers="hover focus"
            >
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />
              <b-form-select class="mt-2" v-model="rgbClassSelected">
                <b-form-select-option :value="null">Select a class</b-form-select-option>
                <b-form-select-option v-if="item.count > 0" v-for="item, index in wbcImageList" :value="item" :key="index">
                  {{ item.title }}
                </b-form-select-option>
              </b-form-select>
              <b-button class="w-100 mt-2" variant="outline-primary" size="sm" @click="onRgbReset">Reset</b-button>
            </b-popover>
          </b-col>
          <b-col>
            <img class="pointer" src="~@/assets/result/excel.png"
              @click="onExport"
              style="width: 30px;"/>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="1">
        <span>
          <img 
            class="pointer mt-1 ml-3" 
            src="~@/assets/result/ic_circle_arrow.png" 
            @click="onClickRollback" 
            style="width: 25px; height: 25px;"/>
        </span>
      </b-col>
    </b-row>
    <b-row class="text-center mt-3" style="user-select: none;">
      <b-col class="pl-1 pb-2" v-for="item in wbcImageList" :key="item.title" style="width: 50px;">
        <div v-if="item.count > 0" v-drag-target
          class="data-draggable-target position-relative pointer"
          :id="'navi_' + item.id + '_' + item.title"
          @click="onClickTab(item)"
          style="width: 50px; height: 50px;">
          <img src="~@/assets/result/class-tab-on.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px; color: #39F6CA;">{{ item.count }}</div>
          </div>
        </div>
        <div v-else v-drag-target
          class="data-draggable-target position-relative"
          :id="'navi_' + item.id + '_' + item.title"
          style="width: 50px; height: 50px;">
          <img src="~@/assets/result/class-tab-off.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div id="title" style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px;"> - </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="pl-0">
        <b-card id="wbcImageCard" class="blackCard" text-variant="white" no-body>
          <div id="wbcImageCardWrapper">
            <!-- <b-row>
              <b-col v-for="wbcImage in wbcImageList.images">
                <img src="wbcImage" style="width: 80px;" />
              </b-col>
            </b-row> -->
            <b-row class="mt-3" v-if="item.count > 0" :id="item.name" v-for="(item, index) in wbcImageList" :key="index + componentKey">
              
              <b-icon v-if="isLisShow && siteCd !== '0007'" class="ml-2 pointer lis-icon"
                icon="file-earmark-arrow-up"
                font-scale="1.8"
                @click="onClickLisUpload"
                style="color: white;"></b-icon>
              
              <b-col>
                <div id="imgTitle" class="userSelectNone pl-3" style="width: 220px;">
                  <b-form-checkbox
                    :id="'check' + item.title"
                    name="selectAll"
                    value="true"
                    unchecked-value="false"
                    @change="onChangeAll($event, 'area_' + item.id + '_' + item.title)"
                  >
                    <span id="imgClassName">{{ item.name }} ( {{ item.count }} )</span>
                  </b-form-checkbox>
                </div>
                <div v-drag-target :id="'area_' + item.id + '_' + item.title" class="data-draggable-target text-left mt-2" @wheel.ctrl="zoom">
                  <img @contextmenu.prevent="$refs.ctxMenu.open" class="pointer data-draggable-item" data-draggable="item"
                    v-for="image, index in item.images"
                    :id="'img' + item.title + index"
                    :key="index"
                    :src="image"
                    :name="item.name"
                    :title="item.title"
                    VLazyImage
                    @dragstart="onDragStart"
                    @dragend="onDragEnd"
                    @dblclick="onDbClick"
                    @click="onClickImg($event, item.name, index)"
                    @load="onImgLoad"
                    signed="false"
                  />
                </div>
              </b-col>
            </b-row>
          </div>

          <!-- right mouse click -->
          <context-menu id="context-menu" ref="ctxMenu">
            <div style="font-size: 12px;">
              <li id="menuOptions" @click="onClickClass(item)" v-for="(item, index) in wbcImageList" :key="item.id + '_' + item.title">
                <div class="p-2">
                  <div v-if="index < 9"> 0{{ index + 1 }}. {{ item.title }} </div>
                  <div v-else> {{ index + 1 }}. {{ item.title }} </div>
                </div>
              </li>
              <li id="menuOptions" @click="onExportImage">
                <div class="p-2">
                  <div>10. Export image</div>
                </div>
              </li>
            </div>
          </context-menu>
        </b-card>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import contextMenu from 'vue-context-menu'
  import lodash from 'lodash'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'
  // import worker from '../../../../workers/promise'
  import XLSX from 'xlsx'
  import Viewer from 'viewerjs'
  import api from '@/service'
  import VLazyImage from 'v-lazy-image/v2'
  
  import {debounce} from 'lodash'

  // import { longClickDirective } from 'vue-long-click'
  // const longClickInstance = longClickDirective({delay: 400, interval: 50})
  // Vue.directive('longclick', longClickInstance)

  const ipcRenderer = require('electron').ipcRenderer

  const fs = require('fs')
  const path = require('path')
  const log = require('electron-log')
  const http = require('http')

  export default {
    name: 'wbc-result-image-list',
    components: { contextMenu, VueSlider, VLazyImage },
    computed: {
      ...mapGetters({
        classList: Constant.GET_WBC_CLASS_LIST,
        bfClassList: Constant.GET_BF_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        currentUser: Constant.GET_CURRENT_USER,
        customClass: Constant.GET_CUSTOM_CLASS,
        currentWbcResult: Constant.GET_CURRENT_WBC_RESULTS,
        getRgbValue: Constant.GET_RGB_VALUE,
        getWbcImageHist: Constant.GET_WBC_IMAGE_HIST,
        rollbackList: Constant.GET_ROLLBACK_LIST
      }),
    },
    props: ['paramItem'],
    watch: {
      paramItem: function (newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.initElement()
        this.componentKey++
      },
      currentWbcResult: function(newVal, oldVal) {
        console.log(newVal)
        this.totalCount = this.$getWbcTotalCount(newVal)
      },
      markerPosition: function (newVal, oldVal) {
        console.log(newVal)
      },
      pbHotKeys: function (newVal, oldVal) {
        console.log(newVal)

        // wbc
        self.wbcHotKey = newVal.filter(function(item) {
          return item.HOT_KEY_TYPE === '01'
        })

        // bf
        self.bfHotKey = newVal.filter(function(item) {
          return item.HOT_KEY_TYPE === '02'
        })
      },
      sliderValue: function (newVal, oldVal) {
        this.setImageStyle()
      },
      brightnessValue: function(newVal, oldVal) {
        this.$store.dispatch(Constant.SET_BRIGHTNESS_SLIDE_VALUE, newVal)
        this.setRgbColor()
      },
      redValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = newVal
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      greenValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = newVal
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      blueValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = newVal
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      rgbClassSelected: function (newVal, oldVal) {
        var self = this

        if (self.rgbClassSelected !== null) {
          const rgbValue = this.getRgbValue.find(function(item) {
            return item.id === self.rgbClassSelected.id
          })

          console.log(rgbValue)

          if (typeof(rgbValue) !== 'undefined') {
            this.redValue = rgbValue.redValue
            this.greenValue = rgbValue.greenValue
            this.blueValue = rgbValue.blueValue
          } else {
            this.redValue = 0
            this.greenValue = 0
            this.blueValue = 0
          }
        }
      }
    },
    data () {
      return {
        isLisShow: false,
        // 롤백 비활성화
        isRollbackDisabled: false,
        // 롤백 버그 방지
        isRollbackInProgress: false,
        // 롤백 횟수 제한
        rollbackCounter: 0,
        selectedImg: null,
        selectedImg2: null,
        // WBC 이미지
        wbcImageList: [],
        isMarker: false,
        sliderValue: 50,
        brightnessValue: 100,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        imgWidth: 180,
        rgbClassSelected: null,
        wbcClassList: [],
        wbcHotKey: [],
        bfHotKey: [],
        imgLoadCount: 0,
        totalCount: 0,
        // 변경 이력 집계
        modifyClassificationList: null,
        modifyBfClassificationList: null,
        componentKey: 0
      }
    },
    beforeDestroy () {
      this.$off('APPEND_CHILD')

      ipcRenderer.removeAllListeners(Constant.GET_WBC_MODIFY_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_BF_MODIFY_LIST)

      ipcRenderer.removeAllListeners('selected-dir')
    },
    mounted () {

      var self = this

      console.log('wbcResultImageList mounted')
      console.log(this.paramItem)
      
      console.log('롤백 카운터값')
      console.log(self.rollbackCounter)
      // self.rollbackCounter = 0

      // lis icon 옮기려고
      this.$nextTick(function () {
        if (this.$route.path.includes('wbcReport')) {
          self.isLisShow = true
        }
      })

      ipcRenderer.on('selected-dir', function (event, results) {
        console.log(results)

        if (results.pathType === 'exportResult') {
          self.onDownloadData(self.$replaceAll(results.path, '\\', '/'))

        } else if (results.pathType === 'wbcClassificationImage') {

          for (var len = self.$getSelectrions().items.length, i = 0; i < len; i++) {
            if (self.$getSelectrions().owner !== null) {
              var src = self.$getSelectrions().items[i].currentSrc
              var url = src.split('/')
              var targetFileName = url[url.length - 1]

              console.log(src)
              console.log(url)
              console.log(targetFileName)

              self.downloadFiles(src, results.path + '/' + targetFileName).then(function(ret) {
                console.log(ret)
              }).catch(function(errMsg) {
                console.log(errMsg)

                self.$toasted.show(errMsg, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              })
            }
          }
        }
      })

      // WBC 변경 이력 집계
      ipcRenderer.on(Constant.GET_WBC_MODIFY_LIST, function (event, result) {
        self.modifyClassificationList = result
        console.log(self.modifyClassificationList)
      })

      // BF 변경 이력 집계
      ipcRenderer.on(Constant.GET_BF_MODIFY_LIST, function (event, result) {
        self.modifyBfClassificationList = result
        console.log(self.modifyBfClassificationList)
      })

      this.$on('APPEND_CHILD', function(fileParams) {
        console.log(fileParams)
        var dirName = ''

        if (self.selectedItem.TEST_TYPE_CD === '02' || self.selectedItem.TEST_TYPE_CD === '03') {
          dirName = self.settings.bfClassDirName
        } else {
          dirName = self.settings.wbcClassDirName
        }

        var params = {
          path: self.settings.pbiaRootPath + '/' +
                self.selectedItem.SLOT_ID + '/' +
                dirName,
          fileList: fileParams.data,
          cassetId: self.selectedItem.CASSET_ID,
          slotId: self.selectedItem.SLOT_ID,
          userId: self.currentUser.userId,
          length: fileParams.data.length,
          wbcImageList: self.wbcImageList,
          type: 'wbc',
          endPoint: 'image'
        }

        console.log(params)
        console.log(self.wbcImageList)

        self.sendMoveFiles(params)
      })
      // self.$store.dispatch(Constant.PB_IA_MOVE_IMAGE, params)
    },
    methods: {
      onClickLisUpload() {
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      getArrowImageSource() {
        // Check the rollbackCounter value and return the appropriate image source
        if (this.rollbackCounter >= 5) {
          return "../../assets/result/ic_circle_arrow_dis.png";
        } else {
          return "../../assets/result/ic_circle_arrow.png";
        }
      },
      onClickImg(event, id, index) {
        var images = document.getElementById(id).querySelectorAll('img')
        // this.selectedImg = null

        if (event.shiftKey) {
          // Shift 키를 누른 상태에서 이미지를 클릭한 경우
          
          if (this.selectedImg == null) {
            this.selectedImg2 = index
            for (var i = 0; i < this.selectedImg2; i++) {
              const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: true})
              const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: true}) 
              images[i].dispatchEvent(mousedownEvent)
              images[i].dispatchEvent(mouseupEvent)
            }
          } else if (this.selectedImg !== null && this.selectedImg2 !== null) {
            this.selectedImg2 = index
            for (var i = this.selectedImg; i < this.selectedImg2; i++) {
              const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: true})
              const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: true}) 
              images[i].dispatchEvent(mousedownEvent)
              images[i].dispatchEvent(mouseupEvent)
            }
          }

          this.selectedImg = null;
          this.selectedImg2 = null;

        } else {
          // 그냥 이미지를 클릭한 경우 (이미지->shift->이미지로 가기 위한 큰 그림)
          this.selectedImg = index
        }
      },
      downloadFiles (url, dest) {
        return new Promise(function(succ, fail) {
          const file = fs.createWriteStream(dest)

          const req = http.get(url, function(res) {
            if (res.statusCode === 200) {
              res.pipe(file)
            } else {
              file.close()
              fs.unline(dest, function() {})
              fail(`Server responded with ${response.statusCode}: ${response.statusMessage}`)
            }
          })

          req.on('error', function(err) {
            file.close()
            fs.unline(dest, function() {})
            fail(err.message)
          })

          file.on('finish', function() {
            succ()
          })

          file.on('error', function(err) {
            file.close()

            // File already exists
            if (err !== 'EEXIST') {
              fs.unlink(dest, function() {})
            }

            fail(err.message)
          })
        })
      },
      initElement () {
        console.log('initElement')
        var self = this
        var dirName = ''
        var classList = []

        // 스크롤 위치 초기화
        document.getElementById('wbcImageCardWrapper').scrollTo(0, 0)

        // BF slide
        if (self.selectedItem.TEST_TYPE_CD === '02' || self.selectedItem.TEST_TYPE_CD === '03') {
          dirName = self.settings.bfClassDirName
          classList = lodash.cloneDeep(self.bfClassList)
        } else {
          dirName = self.settings.wbcClassDirName
          classList = lodash.cloneDeep(self.classList(self.selectedItem.IS_NS_NB_INTEGRATION))
        }

        self.EventBus.$emit('OVERLAY', {state: true})
        Promise.all([
          api.PbIaGetFiles({
            path: self.settings.pbiaRootPath + '/' +
                  self.selectedItem.SLOT_ID + '/' +
                  dirName,
            endPoint: 'images'
          }),
          api.PbIaGetMarkerPosition({
            path: self.settings.pbiaRootPath + '/' +
                  self.selectedItem.SLOT_ID + '/' +
                  dirName,
            fileName: self.selectedItem.SLOT_ID + '.json',
            endPoint: 'marker'
          }),
          api.PbIaGetHotKeys({
            endPoint: 'hotKey'
          })
        ]).then(function(results) {
          console.log(results)
          self.EventBus.$emit('OVERLAY', {state: false})
          // image list
          if (results[0].data.errorCode === 'E0000') {
            self.wbcImageList = []
            self.customClass.forEach(function(customItem) {
              if (customItem.CLASS_NM !== '' && customItem.CLASS_TITLE) {
                var obj = {
                  id: customItem.CLASS_ID,
                  title: customItem.CLASS_TITLE,
                  name: customItem.CLASS_NM
                }
                classList.push(obj)
              }
            })

            var wbcImgResults = results[0].data.results
            classList.forEach(function(item) {
              var classImages = wbcImgResults.filter(function(image) {
                return image.includes(item.id + '_' + item.title)
              })

              var obj = {
                id: item.id,
                title: item.title,
                name: item.name,
                count: classImages.length,
                images: classImages
              }

              self.wbcImageList.push(obj)
            })

            console.log(self.wbcImageList)

            // update class count
            api.PbIaUpdateClassCount({
              classList: self.wbcImageList,
              cassetId: self.selectedItem.CASSET_ID,
              slotId: self.selectedItem.SLOT_ID,
              endPoint: 'class/count'
            }).then(function(res) {
              console.log(res)

              ipcRenderer.send(Constant.GET_WBC_COUNT, JSON.stringify({
                cassetId: self.selectedItem.CASSET_ID,
                slotId: self.selectedItem.SLOT_ID,
                testType: self.selectedItem.TEST_TYPE
              }))

            }).catch(function(err) {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            })
          } else {
            self.$toasted.show(results[0].data.errorMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

          // marker
          if (results[1].data.errorCode === 'E0000') {
            self.markerPosition = results[1].data.results
          } else {
            self.$toasted.show(results[1].data.errorMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

          // hotkey
          if (results[2].data.errorCode === 'E0000') {
            self.wbcHotKey = results[2].data.results.filter(function(item) {
              return item.HOT_KEY_TYPE === '01'
            })
            self.bfHotKey = results[2].data.results.filter(function(item) {
              return item.HOT_KEY_TYPE === '02'
            })
          } else {
            self.$toasted.show(results[2].data.errorMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

          self.isMarker = self.settings.isMarker
          self.sliderValue = self.settings.sizeSildeValue
          self.brightnessValue = self.settings.brightnessSlideValue
          self.setImageStyle()

        }).catch(function (err) {
          console.log(err.message)
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
          self.EventBus.$emit('OVERLAY', {state: false})
        })
      },
      setImageStyle () {
        var self = this

        self.$nextTick(function() {
          var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var maxWidth = 360
          var offsetWidth = (maxWidth * (self.sliderValue / 100)).toFixed(0)

          for (var i = 0; i < images.length; i++) {
            if (offsetWidth >= 120) {
              images[i].style.width = offsetWidth + 'px'
              self.imgWidth = offsetWidth + 'px'
            } else {
              images[i].style.width = '120px'
              self.imgWidth = '120px'
            }
          }

          if (self.isMarker) {
            self.drawCellMarker()
          }

          self.setRgbColor()
          self.$store.dispatch(Constant.SET_SIZE_SLIDE_VALUE, self.sliderValue)
        })
      },
      setRgbColor () {
        var self = this

        console.log(self.getRgbValue)
        var classTemp = this.wbcImageList.filter(function(item) {
          return item.count > 0
        })

        log.info(classTemp)

        var setRgbIds = []

        // rgb
        classTemp.forEach(function(drawClass) {
          self.getRgbValue.forEach(function(rgbClass) {
            if (drawClass.id === rgbClass.id) {
              setRgbIds.push(rgbClass.id)
              var element = document.getElementById('area_' + rgbClass.id + '_' + rgbClass.title)
              if (element !== null) {
                var images = element.querySelectorAll('img')
                for (var i = 0; i < images.length; i++) {
                  images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + rgbClass.redValue + ',' + rgbClass.greenValue + ',' + rgbClass.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                }
              }
            } else {
              if (setRgbIds.indexOf(drawClass.id) < 0) {
                var element = document.getElementById('area_' + drawClass.id + '_' + drawClass.title)
                if (element !== null) {
                  var images = element.querySelectorAll('img')
                  for (var i = 0; i < images.length; i++) {
                    images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(0, 0, 0)) brightness(' + self.brightnessValue + '%)'
                  }
                }
              }
            }
          })
        })

        this.getRgbValue.forEach(function(item) {
          var element = document.getElementById('area_' + item.id + '_' + item.title)
          if (element !== null) {
            var images = element.querySelectorAll('img')
            for (var i = 0; i < images.length; i++) {
              images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + item.redValue + ',' + item.greenValue + ',' + item.blueValue + ')) brightness(' + self.brightnessValue + '%)'
            }
          }
        })
      },
      getFiles() {
        var self = this
        var dirName = ''
        var classList = []

        if (self.selectedItem.TEST_TYPE_CD === '02' || self.selectedItem.TEST_TYPE_CD === '03') {
          dirName = self.settings.bfClassDirName
          classList = lodash.cloneDeep(self.bfClassList)
        } else {
          dirName = self.settings.wbcClassDirName
          classList = lodash.cloneDeep(self.classList(self.selectedItem.IS_NS_NB_INTEGRATION))
        }

        api.PbIaGetFiles({
          path: self.settings.pbiaRootPath + '/' +
                self.selectedItem.SLOT_ID + '/' +
                dirName,
          endPoint: 'images'
        }).then(function(results) {
          console.log(results)

          self.wbcImageList = []
          self.customClass.forEach(function(customItem) {
            if (customItem.CLASS_NM !== '' && customItem.CLASS_TITLE) {
              var obj = {
                id: customItem.CLASS_ID,
                title: customItem.CLASS_TITLE,
                name: customItem.CLASS_NM
              }
              classList.push(obj)
            }
          })

          console.log(classList)
          var wbcImgResults = results.data.results
          classList.forEach(function(item) {
            var classImages = wbcImgResults.filter(function(image) {
              return image.includes(item.id + '_' + item.title)
            })

            var obj = {
              id: item.id,
              title: item.title,
              name: item.name,
              count: classImages.length,
              images: classImages
            }

            self.wbcImageList.push(obj)
          })

          self.$initDrag()
          self.setImageStyle()

          setTimeout(function () {
            ipcRenderer.send(Constant.GET_WBC_COUNT, JSON.stringify({
              cassetId: self.selectedItem.CASSET_ID,
              slotId: self.selectedItem.SLOT_ID,
              testType: self.selectedItem.TEST_TYPE
            }))

            ipcRenderer.send(Constant.GET_IMAGE_ROLLBACK_LIST, JSON.stringify({
              cassetId: self.selectedItem.CASSET_ID,
              slotId: self.selectedItem.SLOT_ID,
              userId: self.currentUser.userId
            }))
          }, 300)
        }).catch(function (err) {
          console.log(err.message)
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        })
      },
      sendMoveFiles (params) {
        var self = this

        self.EventBus.$emit('OVERLAY', {state: true})

        console.log(params)
        api.PbIaMoveImage(params).then(function(results) {
          console.log(results)
          if (results.data.errorCode === 'E0000') {
            setTimeout(function() {
              self.getFiles()
            }, 50)
          }

        }).catch(function (err) {
          console.log(err.message)
        }).finally(function() {
          self.EventBus.$emit('OVERLAY', {state: false})
        })
      },
      moveFiles (item) {
        var self = this
        var fileList = []

        console.log(self.$getSelectrions())

        // 동일 class return
        if (self.$getSelectrions().owner.id.substr(5, 2) === item.id) {
          return false
        }

        self.$getSelectrions().items.forEach(function(selectItem) {
          var urlArray = selectItem.currentSrc.split('/')
          var fileName = urlArray[urlArray.length - 1]
          var obj = {
            targetId: item.id + '_' + item.title,
            srcId: self.$getSelectrions().owner.id,
            image: self.$getSelectrions().items,
            currentSrc: selectItem.currentSrc,
            fileName: fileName,
            name: selectItem.name,
            srcTitle: selectItem.title,
            targetTitle: item.title,
            srcClassId: self.$getSelectrions().owner.id.substr(5, 2),
            targetClassId: item.id,
            index: 0,
            length: self.$getSelectrions().items
          }

          fileList.push(obj)
        })

        console.log(fileList)
        var dirName = ''
        if (self.selectedItem.TEST_TYPE_CD === '02' || self.selectedItem.TEST_TYPE_CD === '03') {
          dirName = self.settings.bfClassDirName
        } else {
          dirName = self.settings.wbcClassDirName
        }

        var params = {
          path: self.settings.pbiaRootPath + '/' +
                self.selectedItem.SLOT_ID + '/' +
                dirName,
          fileList: fileList,
          cassetId: self.selectedItem.CASSET_ID,
          slotId: self.selectedItem.SLOT_ID,
          userId: self.currentUser.userId,
          length: fileList.length,
          wbcImageList: self.wbcImageList,
          type: 'wbc',
          endPoint: 'image'
        }

        self.sendMoveFiles(params)

        // self.$store.dispatch(Constant.PB_IA_MOVE_IMAGE, params)
      },
      onKeyUp (evt) {
        console.log('onKeyUp')

        var self = this
        var key = evt.key.toLowerCase()
        var targetItem = null
        var hotKey = null

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          hotKey = this.wbcHotKey
        } else {
          hotKey = this.bfHotKey
        }

        hotKey.forEach(function (item, index) {
          if (item.HOT_KEY === evt.key.toLowerCase()) {
            self.removeMarker()
            targetItem = item
          }
        })

        console.log(targetItem)
        if (targetItem !== null) {
          var item = {
            id: targetItem.CLASS_ID,
            name: targetItem.CLASS_NM,
            title: targetItem.CLASS_TITLE
          }
          self.moveFiles(item)
        }
      },
      drawCellMarker () {
        console.log('drawCellMarker')
        console.log(this.markerPosition)

        var self = this
        var divCardWrapper = document.getElementById('wbcImageCardWrapper')
        var images = divCardWrapper.querySelectorAll('img')

        self.removeMarker()

        setTimeout(function() {
          images.forEach(function(item) {
            var divNode = document.createElement('div')
            divNode.className = 'cellMarker'
            divNode.id = 'div' + item.id
            divNode.style.width = '5px'
            divNode.style.height = '5px'
            divNode.style.border = '2px solid #00FF00'
            divNode.style.position = 'absolute'
            divNode.style.left = item.offsetLeft + 'px'
            divNode.style.top = item.offsetTop + 'px'

            item.parentNode.appendChild(divNode)

            var url = item.currentSrc.split('/')
            var srcFileName = url[url.length - 1]

            if (self.markerPosition.length > 0) {
              self.markerPosition.forEach(function (position) {
                if (position.FILE_NM === srcFileName) {
                  if (position.POSX1 !== 0 && position.POSX2 !== 0) {
                    var widthRatio = (item.offsetWidth / Number(position.ORG_WIDTH) * 100).toFixed(0)
                    var heightRatio = (item.offsetHeight / Number(position.ORG_HEIGHT) * 100).toFixed(0)

                    var rectWidth = (Number(position.POSX2) - Number(position.POSX1)) * (widthRatio / 100)
                    var rectHeight = (Number(position.POSY2) - Number(position.POSY1)) * (heightRatio / 100)

                    divNode.style.left = item.offsetLeft + (Number(position.POSX1) * (widthRatio / 100)) + (rectWidth / 2) + 'px'
                    divNode.style.top = item.offsetTop + (Number(position.POSY1) * (heightRatio / 100)) + (rectHeight / 2) + 'px'

                    item.parentNode.appendChild(divNode)

                  } else {
                    divNode.style.display = 'none'
                  }
                }
              })
            }
          })
        }, 500)
      },
      removeMarker () {
        console.log('removeMarker')

        var markers = document.querySelectorAll('.cellMarker')
        if (markers.length > 0) {
          markers.forEach(function(marker) {
            marker.remove()
          })
        }
      },
      onChangeMarker (value) {
        console.log('onChangeMarker')
        this.$store.dispatch(Constant.UPDATE_MARKER_STATE, value)
        if (value) {
          this.drawCellMarker()
        } else {
          this.removeMarker()
        }
      },
      onSliderDragStart () {
        console.log('onSliderDragStart')

        this.removeMarker()
      },
      onSliderDragEnd () {
        console.log('onSliderDragEnd')
      },
      onRgbReset () {
        console.log('onRgbReset')
        if (this.rgbClassSelected !== null) {

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = 0
          rgbItem.greenValue = 0
          rgbItem.blueValue = 0

          this.redValue = 0
          this.greenValue = 0
          this.blueValue = 0
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)

        } else {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onImgLoad (evt) {
        var self = this
        this.imgLoadCount++

        if (this.totalCount <= this.imgLoadCount) {
          this.imgLoadCount = 0
          if (this.isMarker) {
            this.drawCellMarker()
          }

          // this.EventBus.$emit('OVERLAY', {state: false})
          this.EventBus.$emit('WBC_IMG_LOADED')
        }
      },      
      onExport () {
        console.log('onExport')
        ipcRenderer.send(Constant.GET_WBC_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))
        ipcRenderer.send(Constant.GET_BF_MODIFY_LIST, JSON.stringify({slotId: this.selectedItem.SLOT_ID}))

        setTimeout(function () {
          ipcRenderer.send('open-file-dialog-for-dir', 'exportResult')
        }, 500)
      },
      onDownloadData (path) {
        console.log('onDownloadData')
        console.log(path)

        var self = this
        var xlsxArr = []
        var classList = null
        var modifyList = null

        if (this.selectedItem.TEST_TYPE === '01' || this.selectedItem.TEST_TYPE === '04') {
          modifyList = this.modifyClassificationList
        } else {
          modifyList = this.modifyBfClassificationList
        }

        console.log(modifyList)
        console.log(self.wbcImageList)

        // title line
        var titleArr = []
        titleArr.push(this.selectedItem.BARCODE_NO)

        self.wbcImageList.forEach(function (item, index) {
          titleArr.push(item.id + '_' + item.title)
        })

        titleArr.push('Total count')
        titleArr.push('Inaccuracy')
        titleArr.push('Accuracy')
        titleArr.push('Accuracy %')

        xlsxArr.push(titleArr)

        // data line
        var totalSum = 0
        var inaccuracySum = 0

        titleArr.forEach(function (titleData) {
          var dataArr = []

          self.wbcImageList.forEach(function (wbcClass) {
            if (titleData === (wbcClass.id + '_' + wbcClass.title)) {
              var isPush = false
              var totalCnt = 0
              var inAccuracyCnt = 0

              // left title
              dataArr.push(titleData)

              // 데이터 있는 row
              modifyList.forEach(function (modifyItem) {
                log.info(titleData)
                log.info( modifyItem.CLASS_ID + '_' + modifyItem.CLASS_TITLE)

                if (titleData === modifyItem.CLASS_ID + '_' + modifyItem.CLASS_TITLE) {
                  isPush = true

                  self.wbcImageList.forEach(function (row) {
                    log.info(row)
                    log.info(modifyItem)

                    dataArr.push(modifyItem[row.id])
                    totalCnt += modifyItem[row.id]
                    totalSum += modifyItem[row.id]

                    if (modifyItem.CLASS_ID !== row.id) {
                      inAccuracyCnt += modifyItem[row.id]
                      inaccuracySum += modifyItem[row.id]
                    }
                  })
                }
              })

              if (isPush) {
                dataArr.push(totalCnt)
                dataArr.push(inAccuracyCnt)
                dataArr.push(totalCnt - inAccuracyCnt)
                dataArr.push((((totalCnt - inAccuracyCnt) / totalCnt) * 100).toFixed(2))

                totalCnt = 0
                inAccuracyCnt = 0
              } else {
                // 데이터 없는 row
                for (var i = 0; i < self.wbcImageList.length + 4; i++) {
                  dataArr.push(0)
                }
              }

              log.info(dataArr)
              xlsxArr.push(dataArr)
            }
          })
        })

        // total line
        var totalArr = []
        totalArr.push('Count')

        self.wbcImageList.forEach(function(classItem) {
          var classCount = 0
          modifyList.forEach(function(modifyItem) {
            classCount += modifyItem[classItem.id]
          })

          totalArr.push(classCount)
        })

        totalArr.push(totalSum)
        totalArr.push(inaccuracySum)
        totalArr.push(totalSum - inaccuracySum)
        totalArr.push((((totalSum - inaccuracySum) / totalSum) * 100).toFixed(2))

        xlsxArr.push(totalArr)

        try {
          var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
          dataWS['!cols'] = [{wpx: 100}]

          // 엑셀의 workbook을 만든다
          var wb = XLSX.utils.book_new()

          // workbook에 워크시트 추가
          XLSX.utils.book_append_sheet(wb, dataWS, '')

          // 엑셀 파일을 내보낸다.
          XLSX.writeFile(wb, path + '/' + self.$getFileNameDateTime() + '_aggr' + '.xlsx')

          this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
        } catch (err) {
          log.info(err)
          this.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onClickTab (item) {
        console.log('onClickTab')
        document.getElementById('wbcImageCardWrapper').scrollTop = document.getElementById(item.name).offsetTop - 60
      },
      onClickRollback: debounce(function() {
        // Debounce는 특정 시간 동안 중복 호출을 무시하고 마지막 호출만을 실행

        console.log('onClickRollback')
        console.log(this.rollbackList)
        var self = this

        if (this.rollbackList.length > 0) {
          self.EventBus.$emit('OVERLAY', {state: true})

          console.log('$$$$$$$')
          console.log(this.rollbackList.length)

          // 뒤에서부터 처리하기 위해 배열을 뒤집음
          const reversedList = this.rollbackList.slice().reverse();

          api.PbRollback({
            cassetId: reversedList[0].CASSET_ID,
            slotId: reversedList[0].SLOT_ID,
            srcPath: reversedList[0].SRC_PATH,
            destPath: reversedList[0].DEST_PATH,
            userId: self.currentUser.userId,
            endPoint: 'rollback'
          }).then(function(results) {
            console.log(results)

            setTimeout(function() {
              self.EventBus.$emit('OVERLAY', {state: false})
              self.getFiles()
            }, 100)

            // 잠간 주석처리해둠
            // self.rollbackCounter++;

            if (self.rollbackCounter >= 5) {
              // Disable the function or perform any other action
              console.log('onClickRollback disabled');
            }

          }).catch(function(err) {
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          })
          .finally(function(){
            console.log("실행되긴함?")
          })
          
        }
      }, 200),
      onChangeAll (state, id) {
        console.log('onChangeAll')
        console.log(this.wbcImageList)
        console.log(state + ':' + id)

        var parent = document.getElementById(id)
        console.log(parent)

        // this.wbcImageList.forEach(function(wbcImage) {
        //   if (parent.id !== 'area_' + wbcImage.id + '_' + wbcImage.title) {
        //     wbcImage.isSelectAll = false
        //   }
        // })

        // 전체 해제
        const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: false})
        const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: false})

        parent.dispatchEvent(mousedownEvent)
        parent.dispatchEvent(mouseupEvent)

        // shift + mousedown + mouseup
        var images = parent.querySelectorAll('img')
        if (state === 'true') {
          console.log(state)
          images.forEach(function(image) {
            const mousedownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true, shiftKey: true})
            const mouseupEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true, shiftKey: true})

            image.dispatchEvent(mousedownEvent)
            image.dispatchEvent(mouseupEvent)
          })
        }
      },
      zoom () {
        console.log('zoom')
      },
      onDragStart () {
        console.log('onDragStart')
        if (this.isMarker) {
          this.drawCellMarker()
        }
      },
      onDragEnd () {
        console.log('onDragEnd')
      },
      onDbClick () {
        var divNode = document.createElement('div')

        this.$getSelectrions().items.forEach(function (item) {
          var clone = item.cloneNode(false)
          divNode.appendChild(clone)
        })

        const viewer = new Viewer(divNode, {maxZoomRatio: 2})
        viewer.show()

        viewer.options.hide = function(e) {
          this.viewer.destroy()
          divNode = null
        }
      },
      onClickClass (item) {
        console.log(item)
        this.moveFiles(item)
      },
      onExportImage () {
        console.log('onExportImage')
        var length = this.$getSelectrions().items.length

        if (length !== 1) {
          this.$toasted.show(Constant.IDS_ERROR_PLEASE_SELECT_AN_IMAGE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          ipcRenderer.send('open-file-dialog-for-dir', 'wbcClassificationImage')
        }
      }
    }
  }
</script>

<style>
  .lis-icon {
    position: fixed;
    right:65px;
    z-index: 1;
  }
  .tabBorderOn {
    border-bottom: 2px solid;
    border-color: #2A9284;
    text-align: center;
    width: 100%;
  }
  .tabBorderOff {
    border-bottom: 2px solid;
    border-color: gray;
    text-align: center;
  }
  #cls {
    color: white;
  }
  #tabCount {
    color: #2A9284;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 15px;
    font-size: 12px;
  }
  #imgClassName {
    font-size: 13px;
    margin-left: 5px;
    /* position: absolute; */
    top: 7px;
  }
  #imgTitle {
    border-bottom: 2px solid #09CBFC;
  }
  #menuOptions:hover {
    background-color: #3F628C;
    color: white;
  }
  #wbcImageCard {
    height: 786px;
  }
  #wbcImageCardWrapper {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .classTab {
    color: white;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
</style>
