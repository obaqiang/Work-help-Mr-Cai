/**
 * 公用表单方法
 *江苏国泰慧贸通企业服务有限公司
 */

/**
	   格式化时间显示方式、用法:format="yyyy-MM-dd hh:mm:ss";
 */
formatDate = function (v, format) {
	if (!v) return "";
	var d = v;
	if (typeof v === 'string') {
		if (v.indexOf("/Date(") > -1)
			d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
		else
			d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
	}
	var o = {
		"M+": d.getMonth() + 1,  //month
		"d+": d.getDate(),       //day
		"h+": d.getHours(),      //hour
		"m+": d.getMinutes(),    //minute
		"s+": d.getSeconds(),    //second
		"q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
		"S": d.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
/**
表单校验
**/
function ValidataForm(formId) {
	$(formId).Validform({
		tiptype: 20, datatype: {//传入自定义datatype类型【方式二】;
			"idcard": function (gets, obj, curform, datatype) {
				//该方法由佚名网友提供;

				var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子;
				var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值，10代表X;

				if (gets.length == 15) {
					return isValidityBrithBy15IdCard(gets);
				} else if (gets.length == 18) {
					var a_idCard = gets.split("");// 得到身份证数组   
					if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
						return true;
					}
					return false;
				}
				return false;

				function isTrueValidateCodeBy18IdCard(a_idCard) {
					var sum = 0; // 声明加权求和变量   
					if (a_idCard[17].toLowerCase() == 'x') {
						a_idCard[17] = 10;// 将最后位为x的验证码替换为10方便后续操作   
					}
					for (var i = 0; i < 17; i++) {
						sum += Wi[i] * a_idCard[i];// 加权求和   
					}
					valCodePosition = sum % 11;// 得到验证码所位置   
					if (a_idCard[17] == ValideCode[valCodePosition]) {
						return true;
					}
					return false;
				}

				function isValidityBrithBy18IdCard(idCard18) {
					var year = idCard18.substring(6, 10);
					var month = idCard18.substring(10, 12);
					var day = idCard18.substring(12, 14);
					var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
					// 这里用getFullYear()获取年份，避免千年虫问题   
					if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
						return false;
					}
					return true;
				}

				function isValidityBrithBy15IdCard(idCard15) {
					var year = idCard15.substring(6, 8);
					var month = idCard15.substring(8, 10);
					var day = idCard15.substring(10, 12);
					var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
					// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
					if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
						return false;
					}
					return true;
				}

			}

		}
	})
}
/********
js获取网站根路径(站点及虚拟目录)
**********/
function RootPath() {
	var strFullPath = window.document.location.href;
	var strPath = window.document.location.pathname;
	var pos = strFullPath.indexOf(strPath);
	var prePath = strFullPath.substring(0, pos);
	var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
	//return (prePath + postPath);如果发布IIS，有虚假目录用用这句
	return (prePath);
}
/********
接收地址栏参数
**********/
function GetQuery(key) {
	var search = location.search.slice(1); //得到get方式提交的查询字符串
	var arr = search.split("&");
	for (var i = 0; i < arr.length; i++) {
		var ar = arr[i].split("=");
		if (ar[0] == key) {
			if (unescape(ar[1]) == 'undefined') {
				return "";
			} else {
				return unescape(ar[1]);
			}
		}
	}
	return "";
}
/********
serialize  Object
**********/
function SerializeObject() {
	$.fn.serializeObject = function () {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
}
/********
submit
**********/
function Submit(FormId, Url) {
	SerializeObject();
	$.ajax({
		url: Url,
		type: "POST",
		dataType: 'json',
		data: { "JsonString": JSON.stringify($(FormId).serializeObject()) },
		beforeSend: function (XMLHttpRequest) {
			 $(FormId).showLoading();
		},
		success: function (result, textStatus) {
			$(FormId).hideLoading();
			ModalMessage(result.Code, result.Message);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(FormId).hideLoading();
			ModalMessage("-1", errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {
			$(FormId).hideLoading();
		}
	});
	return false;
}
/********
submit with callback
**********/
function SubmitWithCallBack(FormId, Url, successCallback) {
	SerializeObject();
	$.ajax({
		url: Url,
		type: "POST",
		dataType: 'json',
		data: { "JsonString": JSON.stringify($(FormId).serializeObject()) },
		beforeSend: function (XMLHttpRequest) {
			$(FormId).showLoading();
		},
		success: function (result, textStatus) {
			$(FormId).hideLoading();
			if ($.isFunction(successCallback)) {
				successCallback(result);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(FormId).hideLoading();
			ModalMessage("-1", errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {
			$(FormId).hideLoading();
		}
	});
	return false;
}
/********
submit
**********/
function SubmitWithParamData(FormId, Url, ParamData) {
	SerializeObject();
	$.ajax({
		url: Url,
		type: "POST",
		dataType: 'json',
		data: { "JsonString": JSON.stringify($(FormId).serializeObject()), "ParamData": ParamData },
		beforeSend: function (XMLHttpRequest) {
			$(FormId).showLoading();
		},
		success: function (result, textStatus) {
			$(FormId).hideLoading();
			ModalMessage(result.Code, result.Message);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(FormId).hideLoading();
			ModalMessage("-1", errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {
			$(FormId).hideLoading();
		}
	});
	return false;
}
/********
submit with callback
**********/
function SubmitWithParamDataWithCallback(FormId, Url, ParamData, successCallback, errorCallback, completeCallback) {
	SerializeObject();
	$.ajax({
		url: Url,
		type: "POST",
		dataType: 'json',
		data: { "JsonString": JSON.stringify($(FormId).serializeObject()), "ParamData": ParamData },
		beforeSend: function (XMLHttpRequest) {
			$(FormId).showLoading();
		},
		success: function (result, textStatus) {
			$(FormId).hideLoading();
			// ModalMessage(result.Code, result.Message);
			if ($.isFunction(successCallback)) {
				successCallback(result);
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			$(FormId).hideLoading();
			ModalMessage("-1", errorThrown);
			if ($.isFunction(errorCallback)) {
				errorCallback(errorThrown);
			}
		},
		complete: function (XMLHttpRequest, textStatus) {
			$(FormId).hideLoading();
			if ($.isFunction(completeCallback)) {
				completeCallback("2");
			}
		}
	});
	return false;
}

/********
处理CKEDITOR的值
**********/
function CKUpdate() {
	for (instance in CKEDITOR.instances)
		CKEDITOR.instances[instance].updateElement();
}
/********
messager
**********/
function ModalMessage(type,messages)
{
    if (messages == "") return false;
    if (typeof (messages) == "undefined") return false;
	switch(type)
	{
		case "1":
			$.messager.alert("成功", messages);
			break;
		case "0":
			$.messager.alert("提示", messages);
			break;
		case "-1":
			$.messager.alert("失败", messages);
			break;
		case "2":
			$.messager.alert("警告", messages);
			break;
	    case "-2":
	        $.messager.alert("错误", messages);
	        break;
	    default:
	        $.messager.alert("提示", messages);
	        break;
	}
   
}

/********
alert
**********/
function AlertMessage(type, messages) {
	var msg = "<div id='alertMessage' class='" + GetAlertType(type) + "'><a href='#' class='close' data-dismiss='alert'>&times;</a>" + messages + "</div>";
	$("body").prepend(msg);
	setTimeout(function () {
		$("#alertMessage").remove();
	}, 3000);
}
/********
alert class type
**********/
function GetAlertType(type) {
	var alertClass = "alert alert-success";
	switch (type) {
		case "1":
			alertClass = "alert alert-success";
			break;
		case "0":
			alertClass = "alert alert-info";
			break;
		case "2":
			alertClass = "alert alert-warning";
			break;
		case "-1":
			alertClass = "alert alert-danger";
			break;
	}
	return alertClass;
}

/*
自动给控件赋值
*/
function SetWebControls(data) {
	for (var key in data) {
		var id = $('#' + key);
		var value = $.trim(data[key]).replace("&nbsp;", "");
		var type = id.attr('type');
		switch (type) {
			case "checkbox":
				if (value == 1 || value.toLowerCase()=="y") {
					$("input[type=checkbox][name='" + key + "'][value='" + value + "']").attr("checked", true);
				} else {
					id.removeAttr("checked");
				}
				break;
			case "radio":
				$("input[type=radio][name='" + key + "'][value='" + value + "']").attr("checked", true);
				break;
			case "select2":
				var values = value.split(',');
				id.val(values).trigger("change");
				break;
			default:
				id.val(value);
				break;
		}
	}
}

/*
ajax post method
url:url
async:true or false
data:parameter
loadingContainer:loading container
callback:callback function
*/
function AjaxJsonPost(url, async, data, loadingContainer, callback) {
	$.ajax({
		type: "post",
		url: url,
		async: async,
		dataType: "json",
		data: data,
		beforeSend: function (XMLHttpRequest) {
			$("#" + loadingContainer).showLoading();
		},
		success: function (dataVal) {
			callback(dataVal)
			$("#" + loadingContainer).hideLoading();
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			ModalMessage("-1", errorThrown);
			$("#" + loadingContainer).hideLoading();
		},
		complete: function (XMLHttpRequest, textStatus) {
			$("#" + loadingContainer).hideLoading();
		}

	})
}

/********
AjaxPost
**********/
function AjaxPost(url, data, successfn) {
	//data = (data == null || data == "" || typeof (data) == "undefined") ? { "date": new Date().getTime() } : data;
	$.ajax({
		type: "post",
		data: data,
		url: url,
		dataType: "json",
		success: function (d) {
			successfn(d);
		}
	});
};
//日期控件
function dateTime(date, fort) {
    $('#' + date).datetimepicker({
        format: fort,
        autoclose: true,
        todayBtn: true,
        language: 'zh-CN',
        startView: 2,
        minView: 2, //设置日期控件列表的显示格式（只显示年，月或者还外加显示时分秒）
        //minView: 0, //设置日期控件列表的显示格式（显示年，月日时分秒）
        //minView: 1, //设置日期控件列表的显示格式（显示年，月日时）
        //maxView: 1,
        pickerPosition: "bottom-left"
    });
}

//draggable

function DoDraggable(dragOp,handle)
{
    $("#" + dragOp).draggable({
        handle: handle,
        cursor: 'move',
        refreshPositions: false
    });
}

/* center modal */
function centerModals(dragOp) {
    $('#' + dragOp).each(function (i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body'); var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}
//自动生成编号
function GetDocNo(Sequence_Name, ControllerId) {
    $.ajax({
        url: "/PutInStorage/GetNewGuid",
        type: "post",
        data: { typeSequence_Name: Sequence_Name },
        async: false,
        success: function (data) {
            $(ControllerId).hideLoading();
            $("#" + ControllerId).val(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ModalMessage("-1", errorThrown);
            $(ControllerId).hideLoading();
        }
    });
}


/*checking  data in  user form*/
function ValidBaseInfoForm() {
    $('#FormBase').validate({
        errorElement: 'em',
        errorClass: 'help-block',
        rules: {
            managetype_sn: {
                required: true,
            },
            restaurant_name: {
                required: true,
            },

            cookingtype_sn: {
                required: true,
            },
            contacts: {
                required: true,
            },
            phone: {
                required: true,
                isMobile:true
            },
            per_consume: {
                required: true,
                number:true
            },
            account_time: {
                required: true
            },
            appointment_phone: {
                isMobile: true
            },
            appointment_phone2: {
                isMobile: true
            },
            appointment_phone3: {
                isMobile: true
            },
            open_start: {
                required: true
            },
            open_end: {
                required: true
            }
            
        },

        highlight: function (element, errorClass) {
            $(element).closest('.form-group div').removeClass('has-info').addClass('has-error');
        },

        success: function (e) {
            $(e).closest('.form-group div').removeClass('has-error');//.addClass('has-info');
            $(e).remove();
        },

        errorPlacement: function (error, element) {
            if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                var controls = element.closest('div[class*="col-"]');
                if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                else error.appendTo(element.nextAll('.lbl:eq(0)').eq(0));
            }
            else if (element.is('.select2')) {
                error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
            }
            else if (element.is('select')) {
                error.insertAfter(element.parent());
            }
            else if (element.is('.chosen-select')) {
                // insertAfter appendTo
                error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
            }
            else {
                error.appendTo(element.parent());
            }
        },

        submitHandler: function (form) {
        },
        invalidHandler: function (form) {
        }
    });
}
