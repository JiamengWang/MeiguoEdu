var Url = "http://" + location.hostname + ':' + location.port;
var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination']);

myApp.controller('StuController', function($scope, $http) {
    $http.get(location.hostname+'/json',{
      params:{'role':'Student'}
    }).then(function (response){
    $students = JSON.parse(response["data"])["results"];
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.stu_rows = [];
    for(var i  = 0; i< $students.length; i++){
      var jsonstu = $students[i];
      $bio_id = jsonstu["_id"];
      // $stu_pic = jsonstu["photo"]=="N.A"?"/img/NA.png":/img/+jsonstu["photo"];
      $cname = jsonstu["chinese_name"];
      $fam_name = jsonstu["family_name"];
      $giv_name = jsonstu["given_name"];
      $eng_name = jsonstu["english_name"];
      $pre_name = jsonstu["preferred_name"];
      $gender = jsonstu["gender"];
      // $hometown = jsonstu["hometown"];
      $counselor = jsonstu["counselor"];
      // $us_address = jsonstu["address"];
      $state = jsonstu["home_city"]+","+ jsonstu["home_state"];
      // console.log("index of the student="+i);
      $index = i;

      $scope.stu_rows.push({
        // 'photo': $stu_pic,
        'cname': $cname,
        'fam_name': $fam_name,
        'giv_name': $giv_name,
        'eng_name': $eng_name,
        'pre_name': $pre_name,
        'gender': $gender,
        // 'hometown':$hometown,
        'counselor':$counselor,
        // 'us_address':$us_address,
        'state':$state,
        'index':$index
      });

    }//for loop
    }), function errorCallback(response) {
      $scope.error = response.data;
    };

  $(document).ready(function(){

    $(document).on('click',"#stu_table .bio_btn", function(e){
      // console.log("bio_btn");
        //  console.log(this.id);

      $id = this.id;
      console.log('click stu detail',$students[$id]);
      $http.get(location.hostname + '/json',{
        params:{'role':'Student','_id':$students[$id]["_id"]}
      }).then(function(response){
        console.log('student info: ',response);
        $studdetail =response["data"];
        console.log($studdetail);
        drawstatus($studdetail["badges"],0);
        drawPieChar("myChart",$studdetail["hours"],"Weekly Activity Pie Chart");
        drawActivityStatistics($studdetail["hours"],$studdetail["happi"]);
        drawHappiMeter('happimeter');
        showTodoList('summary_todo',null,$studdetail["todolist"],'student');
        drawTodoList('todolist','donetodolist',$studdetail["todolist"],'student');
        drawActivityTable("activityLog");
        $bio_photo = $studdetail["photo"];
        $bio_name = $studdetail["given_name"]+" "+$studdetail["family_name"] +" ("+$studdetail["english_name"]+")";
        $bio_chinese_name = $studdetail["chinese_name"];
        $bio_gender = $studdetail["gender"];
        $bio_birthday = $studdetail["birthday"]; //birthday alert???
        $bio_hometown = $studdetail["birthCity"];
        $bio_counselor = $studdetail["counselor"];
        $bio_address = $studdetail["current_street"]+", "+$studdetail["current_city"]+", "+$studdetail["current_state"];
        $bio_email = "<a href=mailto:"+$studdetail["email"]+">"+$studdetail["email"]+"</a>";
        $bio_phone = "<a href=tel:"+$studdetail["phone"]+">"+$studdetail["phone"]+"</a>";
        $bio_weChat = $studdetail["weChat"];
        $bio_skype = $studdetail["skype"];
        $bio_religion = $studdetail["religion"];
        if($bio_religion == null){
          $bio_religion = "N.A";
        }

        $bio_pLan = $studdetail["primary_language"];
        $cur_school_eName = $studdetail["school"]["english_name"];
        $cur_school_cName = $studdetail["school"]["chinese_name"];
        $cur_school_pinyin = $studdetail["school"]["chinese_pinyin"];
        $cur_school_address = $studdetail["school"]["city"]+", "+$studdetail["school"]["state"]+", "+$studdetail["school"]["address"]+" "+$studdetail["school"]["zip"];
        $cur_school_phone = $studdetail["school"]["phone"];
        $cur_school_attendence = $studdetail["school"]["type_attendance"];
        $cur_school_grade_lvl = $studdetail["school"]["current_grade_lvl"];
        $cur_school_grade = $studdetail["school"]["grade_complete"];
        $cur_school_start = $studdetail["school"]["start_date_attendance"];

        $cur_school_principal_cname = $studdetail["school"]["principal"]["chinese_name"];
        $cur_school_principal_pinyin = $studdetail["school"]["principal"]["chinese_pinyin"];
        $cur_school_principal_ename = $studdetail["school"]["principal"]["english_name"];
        if($cur_school_principal_cname == null){
          $cur_school_principal_cname = "N.A";
        }
        if($cur_school_principal_pinyin == null){
          $cur_school_principal_pinyin = "N.A";
        }
        if($cur_school_principal_ename == null){
          $cur_school_principal_ename = "N.A";
        }

        $pre_school_eName = $studdetail["previous_school"]["english_name"];
        $pre_school_cName = $studdetail["previous_school"]["chinese_name"];
        $pre_school_pinyin = $studdetail["previous_school"]["chinese_pinyin"];
        $pre_school_address = $studdetail["previous_school"]["address"];
        if($pre_school_address == null){
          $pre_school_address = "N.A";
        }
        $pre_school_phone = $studdetail["previous_school"]["phone"];
        $pre_school_attendence = $studdetail["previous_school"]["type_attendance"];
        $pre_school_grade = $studdetail["previous_school"]["grade_complete"];
        $pre_school_start = $studdetail["previous_school"]["start_date"];
        $pre_school_end = $studdetail["previous_school"]["end_date"];
        $pre_school_principal_cname = $studdetail["previous_school"]["principal"]["chinese_name"];
        $pre_school_principal_pinyin = $studdetail["previous_school"]["principal"]["chinese_pinyin"];
        $pre_school_principal_ename = $studdetail["previous_school"]["principal"]["english_name"];
        if($pre_school_principal_cname == null){
          $pre_school_principal_cname = "N.A";
        }
        if($pre_school_principal_pinyin == null){
          $pre_school_principal_pinyin = "N.A";
        }
        if($pre_school_principal_ename == null){
          $pre_school_principal_ename = "N.A";
        }

          $stu_bio_str = "<tbody><tr><td>"+
          "<div class='row'>"+
          "<div class='col-md-6 col-sm-6 pic_style'><img src=/img/"+$bio_photo+" height='170' width='140' style='margin-bottom: 10px;'/></div>"+
          // "<div class='col-md-6'>"+$bio_id+"</div>"+

          "<div class='col-md-6 col-sm-6'><table class='table no_b_margin box-shadow'>"+
            "<tr><td><b>Name: </b>"+$bio_name+"</td></tr>"+
            "<tr><td><b>Chinese Name: </b>"+$bio_chinese_name+"</td></tr>"+
            "<tr><td><b>Counselor: </b>"+$bio_counselor+"</td></tr>"+
            "<tr><td><b>Birthday: </b>"+$bio_birthday+"</td></tr>"+
            "<tr><td><b>Hometown: </b>"+$bio_hometown+"</td></tr>"+
            // "<tr><td>Contact: "+"<a href=tel:"+$bio_contact+">"+$bio_contact+"</a></td></tr>"+
          "</table></div>"+
          "</div></td></tr>"+
          "<tr><td><div><table class='table box-shadow table_aligned'>"+
          // "<tr><th class='no_top_border'>Start Term</th><td class='no_top_border'>"+moment($bio_start).format('MMM D, YYYY')+"</td></tr>"+
          // "<tr><th>End Term</th><td>"+moment($bio_end).format('MMM D, YYYY')+"</td></tr>"+
          // "<tr class='hidden-sm hidden-xs'><th>Term</th><td><div class='progress'><div class='progress-bar progress-bar-success' style='width:"+$bio_term_str+";'>"+$bio_term_str+"</div></div></td></tr>"+
          "<tr><th>Address</th><td>"+$bio_address+"</td></tr>"+
          "<tr><th>Email</th><td>"+$bio_email+"</td></tr>"+
          "<tr><th>Phone</th><td>"+$bio_phone+"</td></tr>"+
          "<tr><th>WeChat</th><td>"+$bio_weChat+"</td></tr>"+
          "<tr><th>Skype</th><td>"+$bio_skype+"</td></tr>"+
          "<tr><th>Religion</th><td>"+$bio_religion+"</td></tr>"+
          "<tr><th>Primary Language</th><td>"+$bio_pLan+"</td></tr>"+
          // "<tr><th>Birthday</th><td>"+moment($bio_birthday).format('MMM D, YYYY')+"</td></tr>"+
          // "<tr><th>Social Links</th><td>"+$bio_social_twitter+" &nbsp;"+$bio_social_facebook+" &nbsp;"+$bio_social_website+"</td></tr>"+
          "</table></div>"+
          "</td></tr>"+
          "</tbody>";

          $stu_acdemic_his_str= "<tbody>"+
          "<tr class='tr_table_toggle' id='tr_toggle_curSchool'><th class='title'>"+
          "<div><button><span>+ </span><span style='display:none'> - </span></button>Current School</div></th><td></td></tr>"+
          "<tr class='tr_hide_cur'><th>School English Name</th><td>"+$cur_school_eName+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>School Chinese Name</th><td>"+$cur_school_cName+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>School Chinese Pinyin</th><td>"+$cur_school_pinyin+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>School Address</th><td>"+$cur_school_address+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>School Phone</th><td>"+$cur_school_phone+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>School Type of Attendance</th><td>"+$cur_school_attendence+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>Current Grade Level</th><td>"+$cur_school_grade_lvl+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>Current Grade</th><td>"+$cur_school_grade+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>Dates of Attendance</th><td>"+$cur_school_start+"</td></tr>"+
          "<tr class='tr_hide_cur'><th class='text_red'>Principal </th></tr>"+
          "<tr class='tr_hide_cur'><th>Principal English Name</th><td>"+$cur_school_principal_ename+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>Principal Chinese Pinyin</th><td>"+$cur_school_principal_pinyin+"</td></tr>"+
          "<tr class='tr_hide_cur'><th>Principal Chinese Name</th><td>"+$cur_school_principal_cname+"</td></tr>"+
          "<tr class='tr_hide_cur'><th class='no_top_border'></th></tr>"+

          "<tr class='tr_table_toggle' id='tr_toggle_preSchool'><th class='title'>"+
          "<div><button><span>+ </span><span style='display:none'> - </span></button>Previous School</div></th><td></td></tr>"+
          "<tr class='tr_hide_pre'><th>School English Name</th><td>"+$pre_school_eName+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Chinese Name</th><td>"+$pre_school_cName+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Chinese Pinyin</th><td>"+$pre_school_pinyin+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Address</th><td>"+$pre_school_address+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Phone</th><td>"+$pre_school_phone+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Type of Attendance</th><td>"+$pre_school_attendence+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Grades Completed</th><td>"+$pre_school_grade+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School Start Date</th><td>"+$pre_school_start+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>School End Date</th><td>"+$pre_school_end+"</td></tr>"+
          "<tr class='tr_hide_pre'><th class='text_red'>Principal </th></tr>"+
          "<tr class='tr_hide_pre'><th>Principal English Name</th><td>"+$pre_school_principal_ename+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>Principal Chinese Name</th><td>"+$pre_school_principal_pinyin+"</td></tr>"+
          "<tr class='tr_hide_pre'><th>Principal Chinese Name</th><td>"+$pre_school_principal_cname+"</td></tr>"+
          "<tr class='tr_hide_pre'><th class='no_top_border'></th></tr>"+
          //
          "<tr class='tr_table_toggle' id='tr_toggle_per'><th class='title'>"+
          "<div><button><span>+ </span><span style='display:none'> - </span></button>Personal Experiences</div></th><td></td></tr>"+
          "<tr class='tr_hide_per'><th>Ever skipped a grade?</th><td>"+$studdetail["previous_education"]["skip"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>Ever repeated a grade?</th><td>"+$studdetail["previous_education"]["repeat"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>Ever been withdrawn or dismissed from <br/>an academic institution or program?</th><td>"+$studdetail["previous_education"]["dimissed"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>Ever received severe disciplinary action <br/>at school or from the community?</th><td>"+$studdetail["previous_education"]["disciplinary"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>Any learning difficulties?</th><td>"+$studdetail["previous_education"]["learning_difficulty"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>College Courses taken</th><td>"+$studdetail["previous_education"]["college_course"]["course"]+"</td></tr>"+
          "<tr class='tr_hide_per'><th>AP Courses taken</th><td>"+$studdetail["previous_education"]["ap_course"]["course"]+"</td></tr>"+
          // "<tr><th>Tests taken</th><td>"+$students[$id]["previous_education"]["general_tests"]+"</td></tr>"+

          "<tr class='tr_table_toggle' id='tr_toggle_fam'><th class='title'>"+
          "<div><button><span>+ </span><span style='display:none'> - </span></button>Family Biographical Information</th><td></td></tr>"+
          "<tr class='tr_hide_fam'><th>Current Live with</th><td>"+$studdetail["family_bio"]["current_live"].toString()+"</td></tr>"+
          "<tr class='tr_hide_fam'><th class='text_red'>Main parent</th><td></td></tr>"+
          getParent($studdetail["family_bio"]["main_parent"])+
          "<tr class='tr_hide_fam'><th class='text_red'>Siblings: </th><td>"+$studdetail["family_bio"]["siblings"]+"</td></tr>"+

          "</tbody>";


          $("#stu_bio_table").html(
            $stu_bio_str
          );

          $("#stu_acdamic_his_table").html(
            $stu_acdemic_his_str
          );

          // drawNameCard($scope,$http);
          drawTeamBoard($scope,$http,drawTodoList);
          initialFlip('GPA');
          initialFlip('WMTA');
          initialFlip('VoM');
          initialFlip('WyZ');
      }),function errorCallback(response) {
          $scope.error = response.data;
      };



    });//ready onClick bio_btn

  });//document ready

})//MyController

myApp.controller('CounsellorController', function($scope, $http) {
    $http.get(location.hostname+'/json',{
      params:{'role':'PMC'}
    }).then(function (response){
    $counsellor = JSON.parse(response["data"])["results"];
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.coun_rows = [];
    for(var i in $counsellor){
      var coun = $counsellor[i];
      // $bio_id = coun["coun__id"];
      $photo = coun["photo"]=="N.A"?"/img/NA.png":coun["photo"];
      $full_name = coun["family_name"]+' '+coun["given_name"];
      $pre_name = coun["preferred_name"];
      $gender = coun["gender"];
      $birthday = coun["birthday"];
      $email = coun["email"];
      $phone = coun["phone"];
      $wechat = coun["wechat"];
      $skype = coun["skype"];
      $religion = coun["religion"];
      $index = i;

      $scope.coun_rows.push({
        'photo': $photo,
        'full_name': $full_name,
        'pre_name': $pre_name,
        'gender': $gender,
        'birthday': $birthday,
        'email': $email,
        'phone':$phone,
        'wechat':$wechat,
        'skype':$skype,
        'religion':$religion,
        'index':$index
      });
    }//for loop
    });
    $(document).ready(function(){
      $(document).on('click',"#counselor_table .coun_btn", function(e){
          $id = this.id;
          console.log($id);
          $http.get(location.hostname + '/json',{
            params:{'role':'PMC','_id':$counsellor[$id]["_id"]}
          }).then(function(response){
            $counselordetail = response["data"];
            console.log($counselordetail);
            $scope.photo = $counselordetail["photo"]=="N.A"?"/img/NA.png":$counselordetail["photo"];
            $scope.full_name = $counselordetail["family_name"]+' '+$counselordetail["given_name"];
            $scope.pre_name = $counselordetail["preferred_name"];
            $scope.gender = $counselordetail["gender"];
            $scope.birthday = $counselordetail["birthday"];
            $scope.email = $counselordetail["email"];
            $scope.phone = $counselordetail["phone"];
            $scope.wechat = $counselordetail["wechat"];
            $scope.skype = $counselordetail["skype"];
            $scope.religion = $counselordetail["religion"];
            showTodoList('dis_coun_todolist','dis_coun_donetodolist',$counselordetail['todolist'],'counselor');
          }),function errorCallback(response) {
              $scope.error = response.data;
          };
        });//ready onClick Counsellor per_btn
    });//document ready
}), function errorCallback(response) {
      $scope.error = response.data;
};//CounsellorController

myApp.controller('DOEController',function($scope, $http){
  $http.get(location.hostname+'/json',{
    params:{'role':'DOE'}
  }).then(function (response){
    console.log(response);
    $doe = JSON.parse(response["data"])["results"];
    console.log($doe);
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.doe_rows = [];
    for(var i in $doe){
      var doe = $doe[i];
      $doe_photo = doe["photo"]=="N.A"?"/img/NA.png":doe["photo"];
      $doe_full_name = doe["family_name"]+' '+doe["given_name"];
      $doe_pre_name = doe["preferred_name"];
      $doe_gender = doe["gender"];
      $doe_birthday = doe["birthday"];
      $doe_email = doe["email"];
      $doe_phone = doe["phone"];
      $doe_wechat = doe["wechat"];
      $doe_skype = doe["skype"];
      $doe_religion = doe["religion"];
      $doe_index = i;
      $scope.doe_rows.push({
        'photo': $doe_photo,
        'full_name': $doe_full_name,
        'pre_name': $doe_pre_name,
        'gender': $doe_gender,
        'birthday': $doe_birthday,
        'email': $doe_email,
        'phone':$doe_phone,
        'wechat':$doe_wechat,
        'skype':$doe_skype,
        'religion':$doe_religion,
        'index':$doe_index
      });
    }//end for
  });
  $(document).ready(function(){
    $(document).on('click',"#doe_table .doe_btn", function(e){
        $doe_id = this.id;
        console.log($doe_id);
        $http.get(location.hostname + '/json',{
          params:{'role':'DOE','_id':$doe[$doe_id]["_id"]}
        }).then(function(response){
          console.log(response)
          // var doe =JSON.parse(response["data"])["results"][0];
          // console.log(coun);
          var doe = response["data"];
          $scope.photo = doe["photo"]=="N.A"?"/img/NA.png":doe["photo"];
          $scope.full_name = doe["family_name"]+' '+doe["given_name"];
          $scope.pre_name = doe["preferred_name"];
          $scope.gender = doe["gender"];
          $scope.birthday = doe["birthday"];
          $scope.email = doe["email"];
          $scope.phone = doe["phone"];
          $scope.wechat = doe["wechat"];
          $scope.skype = doe["skype"];
          $scope.religion = doe["religion"];

        }),function errorCallback(response) {
            $scope.error = response.data;
        };
      });//ready onClick Counsellor per_btn

  });//document ready
}),function errorCallback(response) {
    $scope.error = response.data;
};//DoeController


myApp.controller('CommitteeController', function($scope, $http) {

})


function unbind(role,id,callback,callin,callin2) {
  var data = 'role='+role+'&_id='+id;
  var sendValue = {'func':'unbind','data':data,'related':$studdetail['related']};
  console.log('unbind: ',sendValue);
  $.ajax({
    url: '/admin',
    type:'POST',
    data: JSON.stringify(sendValue),
    success: function(data) {
      console.log(data);
      if (data == '200') {
        // var removeid = '#namecard_'+id;
        // var namecard = $(removeid)[0];
        // console.log(removeid,namecard);
        // namecard.parentNode.removeChild(namecard);
        console.log(callin);
        callback(callin,callin2);
      }
      dealresponse(data);
    }
  });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getFormInfo(id) {
  var form = document.getElementById(id);
  var keyValue ="";
  var tagElements = form.getElementsByTagName('input');
  var temp;
  var regular = /(text|email|date|textarea|hidden)/;
  for (var j = 0; j < tagElements.length; j++){
    temp = tagElements[j];
    if(!temp.value) continue;
    if (regular.exec(temp.type)  && temp.value) {
      if(keyValue.length != 0) {
        keyValue += '&';
      }
      // console.log(temp.name,' = ',temp.value);
      keyValue += (temp.name+'='+temp.value);
    } else if( (temp.type == 'radio' || temp.type=='checkbox') && temp.checked != false) {
      // console.log(temp.name,' = ',temp.value,'  checked:',temp.checked);
      if(keyValue.length != 0) {
        keyValue += '&';
      }
      keyValue += (temp.name+'='+temp.value);
    }
  }
  console.log("1: ",keyValue);

  // var options = $("select");
  var options = $(form).find("select");
  console.log(options);
  for (var i =0; i<options.length;i++) {
      temp = options[i];

    // if (temp.selec) {
      if(keyValue.length != 0) {
        keyValue += '&';
      }
      keyValue += (temp.name+'='+temp.value);
      console.log('option: ',keyValue);
    }

  var textArea = $(id + " textarea");
  for (var i =0; i < textArea.length;i++) {
    temp = textArea[i];
    if (keyValue.length != 0) {
      keyValue += '&';
    }
    keyValue += (temp.name+'='+temp.value);
  }
  // console.log('getFormInfo:',keyValue);
  return keyValue;
}

function sendForm(mfunc,mtype,murl,id) {
    console.log(mfunc,id);
    var keyvalue = getFormInfo(id);

    var sendvalue = {"func":mfunc,"data":keyvalue};
    if (mfunc == "bind") {
      console.log('in bind');
      sendvalue["related"] = $studdetail["related"];
    }
    console.log(sendvalue);
    $.ajax({
      url: murl,
      type: mtype,
      data: JSON.stringify(sendvalue),// or $('#myform').serializeArray()
      success: function(data) {
        console.log(data);
        dealresponse(data);
      }
    });
}
function dealresponse(data) {
  if (data == "200") {
    alert("success");
  } else {
    alert("fail");
  }
}

// function drawstatus (badges,ignore) {
//   if (typeof(badges) != 'object') {
//     return;
//   }
//   var statistic = [0,0,0,0,0,0,0,0,0];
//   var gains = {};
//   for (var i in badges) {
//     var index = badges[i].charCodeAt(0) - 97;
//     if (index > 8) {
//       continue;
//     }
//     setbadgeColor(badges[i],ignore);
//     if (!gains[index]) {
//       gains[index] = '';
//     }
//     gains[index] += ($('.'+badges[i]+' i')[0].outerHTML);
//
//     statistic[index] += 1;
//   }
//   // console.log(gains);
//   drawGains(gains);
//   var complete = $('.complete span');
//   var numerators = $('.numerator');
//   var denominators = $('.denominator');
//   console.log(complete,numerators,denominators);
//   console.log(statistic,gains);
//   for (var i = 0; i < statistic.length; i++) {
//     // console.log(i,denominators[i].innerHTML,statistic[i]);
//     complete[i].innerHTML = parseInt((statistic[i]/parseInt(denominators[i].innerHTML))*100);
//     numerators[i].innerHTML = statistic[i];
//   }
//   var sum = $('td i').length;
//   console.log(sum,badges.length);
//   $('#totalnum').html(sum);
//   $('#completepercent').html(parseInt((badges.length/sum)*100)+'%');
//   $('#recentbadge').html($('.'+badges[badges.length - 1]+' i')[0].outerHTML);
// }

function drawGains(gains) {
  var gain_stat = $('.gains');
  for (var i = 0; i < 9; i++) {
    if (gain_stat[i]) {
      gain_stat[i].innerHTML = '';
      if (gains[i]) {
        gain_stat[i].innerHTML = gains[i];
      }
    }
  }
  // console.log(gains,gain_stat);
}

function drawstatusForClass (id,mode) {
  var complete = $('.complete span');
  // console.log(complete[0]);
  var numerators = $('.numerator');
  var denominators = $('.denominator');
  var index = id.charCodeAt(0) - 97;
  if (mode == 1) {
    complete[index].innerHTML = parseInt(((parseInt(numerators[index].innerHTML) + 1)/parseInt(denominators[index].innerHTML))*100);
    numerators[index].innerHTML = parseInt(numerators[index].innerHTML) + 1;
  } else {
    complete[index].innerHTML = parseInt(((parseInt(numerators[index].innerHTML) - 1)/parseInt(denominators[index].innerHTML))*100);
    numerators[index].innerHTML = parseInt(numerators[index].innerHTML) - 1;
  }
}

function setbadgeColor (id,ignore) {
  // var badge = document.getElementsByClassName(id);
  var badge = $('.'+id+' .fa');
  // console.log(badges);
  // console.log(id,badge);
  for (var i in badge) {
    if (!badge[i].style) {
      continue;
    }
    if (badge[i].style.color == 'rgb(79, 76, 76)' && ignore != 1) {
      badge[i].style.color = 'rgb(221, 221, 221)';
      // badge.style.fontcolor = 'rgb(79, 76, 76)';
    } else {
      badge[i].style.color = 'rgb(79, 76, 76)';
      // badge.style.fontcolor = 'rgb(221, 221, 221)';
    }
  }
}
function setbadges(id) {
  console.log('badge id is:',id);
  var _id = $studdetail["_id"];
  var data = 'operation=add&_id='+_id+'&badge='+id;
  var sendvalue = {"func":'badges',"data":data};
  $.ajax({
    url: Url+'/admin',
    type: 'PUT',
    data:JSON.stringify(sendvalue),
    dataType:"json",
    success: function(data){
      // console.log(data);
      if (typeof(data) != 'object') {
        alert('badge set fail');
      }
      $studdetail['badges'] = data;
      setbadgeColor(id);
      drawstatus(data,1);
      // if (data == "200") {
      //   // $studdetail['badges'].push(id);
      //   console.log('before update:',$studdetail['badges']);
      //   updateList($studdetail['badges'],id);
      //   console.log('after update:',$studdetail['badges']);

      //   // drawstatus($studdetail['badges']);
      // } else {
      //   alert('badge set fail');
      // }
    }
  });
}

var updateList = function(array,tar) {
  // console.log('addToList: ',array,tar);
  if (typeof(array) != "object" || typeof(tar) != "string") {
    console.log("wrong data");
    return;
  } else {
    var index = array.indexOf(tar);
    if (index == -1) {
      array.push(tar);
      drawstatusForClass(tar,1);
    } else {
      array.splice(index,1);
      drawstatusForClass(tar,0);
    }
  }
};

/////////////////////////ALL FUNCTIONS FOR MANAGE PANEL//////////////////////
