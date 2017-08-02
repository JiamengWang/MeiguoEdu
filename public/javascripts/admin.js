/**
 * Created by wjm-harry on 7/28/17.
 */
function mysort(id,field) {
    console.log('sort by ',field);
    if (field == 'hours' || field == 'happi' || field == 'week' || field == 'due') {
        $("#"+id+" .data").sort(function(a,b){
            var val_a = parseInt(a.getAttribute(field));
            var val_b = parseInt(b.getAttribute(field));
            console.log(val_a,val_b, val_a > val_b);
            if (val_a > val_b) {
                return 1;
            } else if (val_a < val_b) {
                return -1;
            }
            return 0;
        }).appendTo("#"+id);
    } else {
        $("#"+id+" .data").sort(function(a,b){

            var chara = a.getAttribute(field).charAt(0);
            var charb = b.getAttribute(field).charAt(0);
            console.log(chara,charb,chara > charb);
            if (chara > charb) {
                return 1;
            } else if (chara < charb) {
                return -1;
            }
            return 0;
        }).appendTo("#"+id);
    }
}
function drawPieChar(id,dataArr) {
    var ctx = document.createElement('canvas');
    var mypie = document.getElementById(id);
    mypie.innerHTML = '';
    mypie.appendChild(ctx);
    // var dataArr = [300, 50, 100];
    if (!dataArr || dataArr.length != 5) {
        console.log("wrong input format!");
        return;
    }
    var data = {
        labels: [
            "Skill",
            "Sports",
            "Volunteer",
            "Work",
            "Other Coursework"
        ],
        datasets: [
            {
                data: dataArr,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#33cccc",
                    "#ff9933"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#33cccc",
                    "#ff9933"
                ]
            }]
    };

    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: data,
        options: {
            animation:{
                animateScale:true
            }
        }
    });
}
function drawHappiMeter(id) {
    var target = document.getElementById(id);
    // var totalhappi = 0;
    // for (var i in $studdetail["happi"]) {
    //   totalhappi += $studdetail["happi"][i];
    // }
    // var totalactivity = 0;
    // for (var j in $studdetail["activityRow"]) {
    //   totalactivity += $studdetail["activityRow"][j].length;
    // }
    var totalhappi = 4;
    var totalactivity = 2;
    var averagehappi = (totalhappi/totalactivity).toFixed(1);
    var percent = (averagehappi/5).toFixed(2)*100;
    var color = '';
    if (percent <= 20) {
        color = 'happi1';
    } else if (percent > 20 && percent <= 40) {
        color = 'happi2';
    } else if (percent > 40 && percent <= 60) {
        color = 'happi3';
    } else if (percent > 60 && percent <= 80) {
        color = 'happi4';
    } else {
        color = 'happi5';
    }
    console.log(percent,color);
    var bar = '<div class="progress"><div class="progress-bar '+color+'" role="progressbar" aria-valuenow="'+averagehappi+'" aria-valuemin="0" aria-valuemax="5" style="width:'+percent+'%">'+averagehappi+'</div></div>';
    target.innerHTML = bar;
}


function prev () {
    $('.carousel').carousel('prev');
}
function next() {
    $('.carousel').carousel('next');
    // $('.materialboxed').materialbox();
}


$(document).ready(function(){
    //  $('.carousel.carousel-slider').carousel({fullWidth: true});
    // $('.materialboxed').materialbox();
    // $('.tabs').tabs();

    $('.carousel.carousel-slider').carousel({fullWidth: true,dist:0});
    $('.carousel').css({'min-height':'100vh'});
    Materialize.updateTextFields();
    $('.collapsible').collapsible();
    $('.collapsible').collapsible('open', 0);
    $('.collapsible').collapsible('open', 1);
    $('.collapsible').collapsible('open', 2);
    $('.collapsible').collapsible('open', 3);


    // $('select').material_select('destroy');
    var arr = [0,1,2,3,4];
    drawPieChar("myChart",arr);
    drawHappiMeter('happimeter');
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    $('select').material_select();
    $('.modal').modal(
        {
            inDuration: 200, // Transition in duration
            outDuration: 200, // Transition out duration
            ready: function(modal, trigger) {
                // alert("Ready");

                console.log(modal, trigger);
            },
            complete: function() {
                console.log("delete!");
            }
        }
    );
    $(".button-collapse").sideNav({
        onClose:function(el){
            console.log(el);
            if (bodylock > 0) {
                $('body').css('overflow-y','hidden');
            } else {
                $('body').css('overflow-y','scroll');
            }
        },
        closeOnClick:true,
    });
    $('ul.tabs').tabs({
        onShow:function(){
            // console.log($('a.medium-text'));
            // $('a.medium-text').css('font-size','1.1em');
        }
    });
    $('.pushpin-demo-nav').each(function() {
        var $this = $(this);
        var $target = $('#' + $(this).attr('data-target'));
        // console.log($this,$target.offset().top,$target.offset().top + $target.outerHeight() - $this.height());
        $this.pushpin({
            top: $target.offset().top,
            bottom: $target.offset().top + $target.outerHeight() - $this.height(),
            // top:0,
            // bottom:500,
            offset: 45
        });
    });
    console.log($('a.medium-text'));
    $('a.medium-text').css('font-size','1.1em');
});
