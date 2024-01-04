import lodash from 'lodash'
import CommonStore from './CommonStore.js'

const state = {
  // Neutrophil 통합 카운트 Neutrophil-Segmented로 전송
  CbcWbcTestCdList_0002: [ {
    id: '01', title: 'NS', name: 'Neutrophil-Segmented', cd: 'LHR10501'
  }, {
    id: '02', title: 'ME', name: 'Metamyelocyte', cd: 'LHR10507'
  }, {
    id: '03', title: 'MY', name: 'Myelocyte', cd: 'LHR10508'
  }, {
    id: '04', title: 'PR', name: 'Promyelocyte', cd: 'LHR10509'
  }, {
    id: '05', title: 'LY', name: 'Lymphocyte', cd: 'LHR10503'
  }, {
    id: '61', title: 'LR', name: 'Reactive lymphocyte', cd: 'LHR10544'
  }, {
    id: '62', title: 'LA', name: 'Abnormal lymphocyte', cd: 'LHR10543'
  }, {
    id: '07', title: 'MO', name: 'Monocyte', cd: 'LHR10504'
  }, {
    id: '08', title: 'EO', name: 'Eosinophil', cd: 'LHR10505'
  }, {
    id: '09', title: 'BA', name: 'Basophil', cd: 'LHR10506'
  }, {
    id: '10', title: 'BL', name: 'Blast', cd: 'LHR10510'
  }, {
    id: '11', title: 'PC', name: 'Plasma cell', cd: 'LHR10517'
  }]
}

const mutations = {

}

const actions = {

}

const getters = {
  CbcWbcTestCdList_0002: (state) => {
    return state.CbcWbcTestCdList_0002
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
