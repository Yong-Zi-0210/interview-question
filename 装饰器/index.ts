//上海银行个人按揭贷款申请书
getShbankLoanInfo(val = {}, obj = {}, times = "") {
  return new Promise((resolve, reject) => {
    app.client.VxJSBridge_call("showWaitPanel");
    let arr = this.peopleList.sort((a, b) => {
      return a.relType - b.relType;
    });
    
    let zjrMarrSts=(this.peopleList.find(item=>{
      return item.relType === "00"
    })||{}).marrSts||' '
    let gjrMarrSts=(this.peopleList.find(item=>{
      return item.relType==='01'
    })||{}).marrSts||' '
    let dbrMarrSts=(this.peopleList.find(item=>{
      return item.relType==='02'
    })||{}).marrSts||' '
    let montageObj = {};
    let year,
      month,
      day = "";
    arr.forEach((item, index) => {
      if (index === 0) {
        year = !item.birthday ? "" : item.birthday.slice(0, 4) + "-";
        month = !item.birthday ? "" : item.birthday.slice(4, 6) + "-";
        day = !item.birthday ? "" : item.birthday.slice(6, 8) + "-";
      } else {
        year += !item.birthday ? "" : item.birthday.slice(0, 4) + "-";
        month += !item.birthday ? "" : item.birthday.slice(4, 6) + "-";
        day += !item.birthday ? "" : item.birthday.slice(6, 8) + "-";
      }

      for (let name in item) {
        if (index === 0) {
          let person = item;
          montageObj[name] = person[name] ? person[name] : " ";
        } else {
          if (!montageObj.hasOwnProperty(name)) {
            let val = "";
            for (let j = 0; j < index; j++) {
              val += " -";
            }
            montageObj[name] = val + (item[name] ? item[name] : " ");
          } else {
            montageObj[name] =
              montageObj[name] + "-" + (item[name] ? item[name] : " ");
          }
        }
      }
      if(index>0){
        this.dataFormater(montageObj,index+1)
      }
    });
    year = year.slice(0, year.length - 1) || " ";
    month = month.slice(0, month.length - 1) || " ";
    day = day.slice(0, day.length - 1) || " ";
    let info = {
      busNo: this.information.busNo,
      ...obj,
      ...val,
      authorizedNo: this.applyPeople.idNo,
      signWriter: this.information.people.idNo, //签名人
      floatRate: this.houseLoanData.grateValue || " ",//利率固定加点值
    };
    let params = {
      relType: montageObj.relType || " ",
      relRole: " ",
      code: " ",
      loanCode: " ",
      handagency: " ",
      source: " ",
      coopPjCode: this.houseLoanData.coopPjCode || " ",
      custName: montageObj.custName || " ",
      sex: montageObj.sex || " ",
      year,
      month,
      day,
      cnty: montageObj.cnty || " ",
      marrSts: montageObj.marrSts || " ",
      idType: montageObj.idType || " ",
      idNo: montageObj.idNo || " ",
      peasontHouseHold: montageObj.isFarmer || " ",
      selfemp: montageObj.isSelf || " ",
      nation: montageObj.nation || " ",
      higedu: montageObj.edu || " ",
      higdeg: montageObj.degree || " ",
      taxResidentType: montageObj.taxResidentType || " ",
      phoneno: montageObj.tel || " ",
      sanmephoneno: " ",
      familyTel: montageObj.tel || " ",
      areaNum: " ",
      hostNum: " ",
      extNum: " ",
      email: montageObj.elecStateAddr || " ",
      livestatus: montageObj.resState || " ",
      liveAddrProvience: montageObj.resProv || " ",
      liveAddrCity:montageObj.resCity || " ",
      liveAddrArear: montageObj.resDist || " ",
      liveAddrDetail: montageObj.resDetAddr || " ",
      comtype: montageObj.commType || " ",
      comAddrProvience: montageObj.commProv || " ",
      comliveAddrCity: montageObj.commCity || " ",
      comliveAddrArear: montageObj.commDist || " ",
      comliveAddrDetail: montageObj.commSurAddr || " ",
      comcode: montageObj.postalCode || " ",
      censusRegProvince: " ",
      censusRegCity: " ",
      censusRegarea: " ",
      censusRegDetail: montageObj.domAddress || " ",
      pfn: montageObj.pfn,
      workCompanyName: montageObj.companyName || " ",
      workCompanyTel: montageObj.companyTel || " ",
      workType: montageObj.type || " ",
      workduties: montageObj.function || " ",
      worktitle: montageObj.titlePost || " ",
      workAddrProvience: montageObj.addrProvience || " ",
      workliveAddrCity: montageObj.addrCity || " ",
      workliveAddrArear: montageObj.addrArear || " ",
      workliveAddrDetail: montageObj.addrDetail || " ",
      emergcOntactName: montageObj.emerContName || " ",
      emergcOntactPhoneNo: montageO