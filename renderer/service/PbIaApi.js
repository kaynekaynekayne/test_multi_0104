import axios from 'axios'
import store from '../store'
import Configs from '../../Configs.js'
// const testUrl = 'http://localhost:18088/api/v1/'
const version = '/api/v1/'
const fs = require('fs')
const apiConf = JSON.parse(fs.readFileSync(Configs.DB_CONFIG_PATH, 'utf-8')).API_CONF
const host = apiConf.host + ':' + apiConf.port

async function PbIaGetFile(params) {
  return axios.get(host + version + params.endPoint, {
    params: {
      path: params.path
    }
  })
}

async function PbIaDeleteFile(params) {
  return axios.delete(host + version + params.endPoint, {
    params: {
      path: params.path
    }
  })
}

async function makeDirectory(params) {
  return axios.post(host + version + params.endPoint, {
    path: params.path
  })
}

async function PbIaWriteFile(params) {
  var formData = new FormData()
  formData.append('destPath', params.destPath)
  formData.append('rbcPositionPath', params.rbcPositionPath)
  formData.append('rbcPosition', params.rbcPosition)
  formData.append('fileName', params.fileName)
  formData.append('image', new Blob([params.rbcCropBuf], {type: 'image/bmp'}))

  console.log(formData.get('image'))
  return axios.post(host + version + params.endPoint, formData, {
  })
}

// get images
async function PbIaGetFiles(params) {
  return axios.get(host + version + params.endPoint, {
    params: {
      path: params.path
    }
  })
}

async function PbIaMoveImage(params) {
  return axios.post(host + version + params.endPoint + '/' + params.type, {
    path: params.path,
    fileList: params.fileList,
    cassetId: params.cassetId,
    slotId: params.slotId,
    userId: params.userId,
    length: params.length,
    malariaCount: params.malariaCount
  })
}

// get marker file(json)
async function PbIaGetMarkerPosition(params) {
  return axios.get(host + version + params.endPoint + '/' + params.fileName, {
    params: {
      path: params.path
    }
  })
}

// get hot keys
async function PbIaGetHotKeys(params) {
  if (params.type) {
    return axios.get(host + version + params.endPoint + '/' + params.type, {
    })
  } else {
    return axios.get(host + version + params.endPoint, {
    })
  }
}

// get custom class
async function PbIaGetCustomClass(params) {
  return axios.get(host + version + params.endPoint, {
  })
}

// update class count
async function PbIaUpdateClassCount(params) {
  return axios.post(host + version + params.endPoint, {
    classList: params.classList,
    cassetId: params.cassetId,
    slotId: params.slotId
  })
}

// slide test list
async function PbGetSlideTestList(params) {
  console.log(store)
  console.log('%%%%%%%%')
  console.log(params)
  console.log('%%%%%%%%')
  // console.log('❌❌axios 요청했을 때 뜨는 에러❌❌')
  return axios.get(host + version + params.endPoint, {
    params: {
      limit: params.limit,
      size: params.size,
      searchType: params.searchType,
      searchText: params.searchText,
      startDate: params.startDate,
      endDate: params.endDate,
      wbcClassList: params.wbcClassList,
      nrCount: params.nrCount,
      wbcTotalSortCd: params.wbcTotalSortCd,
      // TEST TYPE 필터링 하려고 추가
      testTypeList: params.testTypeList
    }
  })
}

async function PbGetSlideClassification (params) {
  return axios.get(host + version + params.endPoint + '/' + params.type, {
    params: {
      type: params.type,
      cassetId: params.cassetId,
      slotId: params.slotId,
      testType: params.testType
    }
  })
}

async function PbGetMatrix (params) {
  return axios.get(host + version + params.endPoint, {
    params: {
      slotIds: params.slotIds
    }
  })
}

async function PbGetLockState (params) {
  return axios.get(host + version + params.endPoint, {
    params: {
      cassetId: params.cassetId,
      slotId: params.slotId
    }
  })
}

async function PbUpdateLockState (params) {
  return axios.post(host + version + params.endPoint, {
    cassetId: params.cassetId,
    slotId: params.slotId,
    lockState: params.lockState
  })
}

async function PbGetMainData (params) {
  return axios.get(host + version + params.endPoint, {
  })
}

async function PbRollback (params) {
  return axios.post(host + version + params.endPoint, {
    cassetId: params.cassetId,
    slotId: params.slotId,
    srcPath: params.srcPath,
    destPath: params.destPath,
    userId: params.userId
  })
}

export default {
  async PbIaGetFile (params) {
    return await PbIaGetFile(params)
  },
  async PbIaDeleteFile (params) {
    return await PbIaDeleteFile(params)
  },
  async makeDirectory (params) {
    return await makeDirectory(params)
  },
  async PbIaWriteFile (params) {
    return await PbIaWriteFile(params)
  },
  async PbIaGetFiles (params) {
    return await PbIaGetFiles(params)
  },
  async PbIaMoveImage (params) {
    return await PbIaMoveImage(params)
  },
  async PbIaGetMarkerPosition (params) {
    return await PbIaGetMarkerPosition(params)
  },
  async PbIaGetHotKeys (params) {
    return await PbIaGetHotKeys(params)
  },
  async PbIaGetCustomClass (params) {
    return await PbIaGetCustomClass(params)
  },
  async PbIaUpdateClassCount (params) {
    return await PbIaUpdateClassCount(params)
  },
  async PbGetSlideTestList (params) {
    return await PbGetSlideTestList(params)
  },
  async PbGetSlideClassification (params) {
    return await PbGetSlideClassification(params)
  },
  async PbGetMatrix (params) {
    return await PbGetMatrix(params)
  },
  async PbGetLockState (params) {
    return await PbGetLockState(params)
  },
  async PbUpdateLockState (params) {
    return await PbUpdateLockState(params)
  },
  async PbGetMainData (params) {
    return await PbGetMainData(params)
  },
  async PbRollback (params) {
    return await PbRollback(params)
  }
}
