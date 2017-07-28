//suggestions for todo list
// 1. make the whole todo list synchronized when there is an update in one table/ no matter it is in todo table or finished table
// 2. In the future, maybe we can get notification from backend to update the todo list in time.

function addRow(table_id,week_id,content_id,due_id,r_id,role,done_id) {
  var display = $('#'+table_id);
  if (role == "student") {
    r_id = $studdetail['related'];
  } else if (role == "counselor") {
    r_id = $studdetail['PMC']['_id'];
  } else {
    return;
  }
  // if (!display[0]) {
  //   return;
  // }
  // var table = display[0];
  // var row = table.insertRow();
  var week= $('#'+week_id)[0].value;
  var content = $('#'+content_id)[0].value;
  var due = $('#'+due_id)[0].value;
  console.log(week,content,due);
  // if (role == ) {
  //
  // }
  data = {'week':week,'content':content,'dueDate':due,'r_id':r_id,'active':true};
  input = {'data':data};
  input['mode'] = 1;
  input['role'] = role;
  input['done_id'] = done_id;
  input['sort'] = true;
  sendtodo('todo','/'+role,'POST',input,generateTodoCell,input,table_id);
}
//
// function deleteRow(table_id,) {
//
// }
function drawTodoList(table_id,done_id,arr,role) {
  initializeTable(table_id,2);
  initializeTable(done_id,1);
  for (var i in arr) {
    var cell = {};
    cell['data'] = arr[i];
    cell['role'] = role;
    cell['done_id'] = done_id;
    if (arr[i]['active']) {
        cell['mode'] = 1;
        generateTodoCell(cell,table_id,false);
    } else {
        cell['mode'] = 0;
        generateTodoCell(cell,done_id,false);
    }
  }
  mysort(table_id,'due');
  mysort(done_id,'due');
}

function showTodoList(todotable_id,donetable_id,arr,role) {
  var todo = todotable_id ? true : false;
  var done = donetable_id ? true : false;
  console.log(todo,done);

  if (todo) initializeTable(todotable_id,1);
  if (done) initializeTable(donetable_id,1);
  // console.log(todotable_id,donetable_id,arr);
  var todo_t = $('#'+todotable_id);
  var done_t = $('#'+donetable_id);
  // console.log(todo_t,done_t);

  todo_t = todo_t[0];
  done_t = done_t[0];

  for (var i in arr) {
    var cell = arr[i];
    if (cell.active) {
      if (todo) getTodoCell(cell,todo_t);
    } else {
      if (done) getTodoCell(cell,done_t);
    }
  }
  if (todo) mysort(todotable_id,'due');
  if (done) mysort(donetable_id,'due');
}
function getTodoCell(input,table) {
  var w = document.createElement("TD");
  var c = document.createElement("TD");
  var date = document.createElement("TD");
  var p = document.createElement("div");

  var week = input.week;
  var content = input.content;
  var due = input.dueDate;
  var row = table.insertRow();
  date.innerHTML = due;
  p.innerHTML = content;
  p.classList.add('todoContent');
  w.innerHTML = week;


  c.appendChild(p);
  row.appendChild(w);
  row.appendChild(c);
  row.appendChild(date);
  // row.id = input._id;
  row.classList.add("todocell");
  row.classList.add("data");
  row.setAttribute('due',due.replace(/-/g,''));
}

function generateTodoCell (input,table_id) {
  console.log(input,table_id);
  var w = document.createElement("TD");
  var c = document.createElement("TD");
  var date = document.createElement("TD");
  var p = document.createElement("div");

  var table = $('#'+table_id)[0];
  var week = input.data.week;
  var content = input.data.content;
  var due = input.data.dueDate;
  var dueNum = due.replace(/-/g,'');
  var mode = input.mode;
  var role = input.role;
  var done_id = input.done_id;
  var row = table.insertRow();
  var now = new Date();
  date.innerHTML = due == null ? now.getTime() : due;
  p.innerHTML = content;
  // if (mode == 1) {
  p.classList.add('todoContent');
    // c.classList.add('todoContent');
  // } else {
  //   p.classList.add('doneTidiContent');
  //   // c.classList.add('doneTidiContent');
  // }
  w.innerHTML= week;
  // c.innerHTML= content;
  c.appendChild(p);
  row.id = input.data._id;
  row.appendChild(w);
  row.appendChild(c);
  row.appendChild(date);
  if (mode == 1) {
    var b1 = document.createElement("TD");
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("done");
    btn.appendChild(t);
    btn.onclick = function() {
      doneOne(row.id,role,done_id);
    }
    b1.classList.add('todoBtn');
    b1.appendChild(btn);
    row.appendChild(b1);
  }

  var b2 = document.createElement("TD");
  var dbtn = document.createElement("BUTTON");
  var dt = document.createTextNode("delete");
  dbtn.appendChild(dt);
  dbtn.onclick = function(){
    deleteOne(row.id,role);
  };
  b2.classList.add('todoBtn');
  b2.appendChild(dbtn);
  row.appendChild(b2);
  row.classList.add("todocell");
  row.classList.add("data");
  row.setAttribute('due',dueNum);
  if (input.sort) {
    mysort(table_id,'due');
  }
}
function initializeTable(id,start) {
  var rows = $('#'+id+' tr');
  for (var i = start; i < rows.length; i++) {
    rows[i].parentNode.removeChild(rows[i]);
  }
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(+d);
  d.setHours(0,0,0,0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay()||7));
  // Get first day of year
  var yearStart = new Date(d.getFullYear(),0,1);
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
}

function setTitle (id) {
  var title = $('#'+id)[0];
  var week = getWeekNumber(new Date());
  title.innerHTML = week[1] + ' Weeks of ' + week[0];
}

function deleteOne (id,role) {
  var sendValue = {};
  sendValue['_id'] = id;
  if (role == "student") {
    sendValue['r_id'] = $studdetail['related'];
  } else if (role == "counselor") {
    sendValue['r_id'] = $studdetail['PMC']['_id'];
  } else {
    return;
  }
  var val = {};
  val['data'] = sendValue;
  console.log(val);
  sendtodo('todo','/'+role,'DELETE',val,removeOneRow,id,null);
}

function doneOne(id,role,done_id) {
  var sendData = {};
  sendData['_id'] = id;
  sendData['subfunc'] = "done";
  var val = {};
  val['data'] = sendData;
  console.log(val);
  sendtodo('todo','/'+role,'PUT',val,removeOneRow,id,done_id);
}

function removeOneRow (id,addto) {
  var cell = $('#'+id);
  console.log(cell,addto);
  for (var i = 0; i < cell.length; i++) {
    cell[i].parentNode.removeChild(cell[i]);
    if (addto) {
      cell = cell[i];
      var childs = cell.childNodes;
      console.log(childs);
      while (childs.length > 4) {
        childs[childs.length - 2].parentNode.removeChild(childs[childs.length - 2]);
      }
      $('#'+addto).append(cell);
      mysort(addto,'due');
    }
  }
}

// function insertIndex (table_id,date) {
//   var
// }

function resetAddrow (id) {
  var row = $('#'+id)[0];
  var parent = row.parentNode;
  parent.removeChild(row);
  parent.appendChild(row);
}
// drawTodoList('todolist',todoarr);
// setTitle('title');

function sendtodo(mfunc,murl,mtype,data,callback,callback_in,callback_in2) {
  var sendvalue = {"func":mfunc,"data":data.data};
  console.log(sendvalue,murl,mtype);
  $.ajax({
    url: murl,
    type: mtype,
    data: JSON.stringify(sendvalue),// or $('#myform').serializeArray()
    success: function(data) {
      console.log(data);
      if (data == "200") {
        callback(callback_in,callback_in2);
      } else if (mtype == "POST") {
        callback_in['data']['_id'] = data;
        callback(callback_in,callback_in2);
      }
      // dealresponse(data);
    }
  });
}
