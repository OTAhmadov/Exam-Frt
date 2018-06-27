/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Exam = {
    // token: 'b762e374123f44bf9a194cd020933932dc204ceaab48484eb3be612521c38c11',
    lang: 'az',
    appId: 1000011,
    currModule: '',
    operationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    top: 0,
    stompClient: 0,
    personId: '',
    Codes: {
        QUESTION_LEVEL: 77,
        QUESTION_TYPE: 78,
        QUESTION_TIPI: 114,
        EDU_LEVEL: 25,
        EDU_COURSE: 1000060,
        EDU_LANG: 36,
        EXAM_TYPE: 116,
        EXAM_FORM_TYPE: 115,
    },
    Type: {
        EXAM_TYPE: 1000106,
        EDU_LEVEL: 1000002,
        EDU_SEMESTER: 1000060,
    },
    Parent: {
        EDU_LEVEL: 1000700,
    },
    tempData: {
        form: ''
    },
    urls: {
        //ROS: "http://localhost:8080/ROS/",
        ROS: "http://192.168.1.78:8082/ROS/",
//         AdminRest: 'http://localhost:8080/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
        // AdminRest: 'http://localhost:8080/AdministrationRest/',
        HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
//        HSIS: "http://localhost:8080/UnibookExamRest/",
//        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        EMS: 'http://192.168.1.78:8082/UnibookEMS/',
        // ExamRest: 'http://localhost:8080/ExamRest/',
       ExamRest: 'http://192.168.1.78:8082/ExamRest/',
        COMMUNICATION: 'http://192.168.1.78:8082/CommunicationRest/',
        NOTIFICATION: 'http://192.168.1.78:8082/NotificationSystem/greeting.html?token=',
        SOCKET: 'http://192.168.1.78:8082/SocketRest',
        REPORT: 'http://192.168.1.78:8082/ReportingRest/'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/AdministrationSystem/greeting.html'
        } else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Exam.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Exam.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Exam.lang.trim().length === 0) {
            Exam.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Exam.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Exam.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Exam.dictionary[Exam.lang][attr]);
            $(this).attr('placeholder', Exam.dictionary[Exam.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
            
            getExamList: function (callback) {
                $.ajax({
                    url: Exam.urls.ExamRest + 'exam/list?token=' + Exam.token,
                    type: 'GET',
                    success: function (result) {
                        try {
                            if (result) {
                                switch (result.code) {
                                    case Exam.statusCodes.OK:
                                        if (callback) {
                                            callback(result.data)
                                        }
                                        Exam.Service.parseExamList(result.data)
                                        break;

                                    case Exam.statusCodes.ERROR:
                                        $.notify(Exam.dictionary[Exam.lang]['error'], {
                                            type: 'danger'
                                        });
                                        break;

                                    case Exam.statusCodes.UNAUTHORIZED:

                                        window.location = Exam.urls.ROS + 'unauthorized';
                                        break;
                                }
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }

                });
            },    

        addExam: function (formData, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'exam/add',
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000119"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Exam.statusCodes.ERROR:
                                if(data.message) {
                                    $.notify(data.message[Exam.lang], {
                                        type: 'danger'
                                    });
                                }
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000119"]').removeAttr('check', 1);
                }
            })
        },
        
        addTicket: function (formData, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'ticket/add',
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Exam.statusCodes.ERROR:
                                if(data.message) {
                                    $.notify(data.message[Exam.lang], {
                                        type: 'danger'
                                    });
                                }
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        loadTicketQuestions: function (ticketId, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'ticket/' + ticketId + '?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                if (callback) {
                                    callback(result.data);
                                }
                                Exam.Service.parseTicketQuestions(result.data)
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },

        getTickets: function (page, params, callback) {
            var data;
            $.ajax({
                url: Exam.urls.ExamRest + 'ticket?token=' + Exam.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:
                                    data= result.data
                                Exam.Service.parseTickets(result.data, page);
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Exam.statusCodes.UNAUTHORIZED:

                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }, 
                complete: function (jqXHR, textStatus) {
                    if (callback) {
                        callback(data);
                    }
                }
            })
        },

        loadEduYear: function (callback) {
            $.ajax({
                url: Exam.urls.EMS + 'course/eduyear?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },

        loadCoursesByGroupId: function (id, callback) {
            $.ajax({
                url: Exam.urls.EMS + 'course/' + id + '?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },

        loadGroups: function (callback) {
            $.ajax({
                url: Exam.urls.EMS + 'course?token=' + Exam.token + '&pageSize=1000000',
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },

        getStructureListByFilter: function (id, levelId, callback) {
            $.ajax({
                url: Exam.urls.HSIS + 'structures/allFilter?token=' + Exam.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                }
            })
        },

        loadOrgTree: function (facultyId, callback) {
            $.ajax({
                url: Exam.urls.HSIS + 'groups/select?token=' + Exam.token + '&orgId=' + facultyId,
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data);
                                    }
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        getExam: function (callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'exam?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data);
                                    }
                                    Exam.Service.parseExam(result.data)
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        getQuestionDetails: function (id, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/' + id + '?token=' + Exam.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000106"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Exam.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000106"]').removeAttr('check', 1);
                }
            })
        },

        removeFile: function (path, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/file/' + path + '/remove?token=' + Exam.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000106"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Exam.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000106"]').removeAttr('check', 1);
                }
            })
        },

        removeTicket: function (id, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'ticket/' + id + '/remove?token=' + Exam.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000106"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Exam.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000106"]').removeAttr('check', 1);
                }
            })
        },
        
        removeQuestion: function (id, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/' + id + '/remove?token=' + Exam.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000106"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Exam.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000106"]').removeAttr('check', 1);
                }
            })
        },

        loadApplications: function () {
            $.ajax({
                url: Exam.urls.ROS + 'applications?token=' + Exam.token,
                type: 'GET',
//                headers: {
//                    'Token': Exam.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    Exam.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Exam.statusCodes.ERROR:
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:
                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadSubApplications: function (callback) {
            $.ajax({
                url: Exam.urls.ROS + 'applications/1000014/subApplications?token=' + Exam.token,
                type: 'GET',
//                headers: {
//                    'Token': Exam.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    if (callback)
                                        callback(data);
//                                    Admin.Service.parseSubApplicationsList(data.data);
//                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Exam.statusCodes.ERROR:
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:
                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Exam.urls.ROS + 'applications/' + Exam.appId + '/modules?token=' + Exam.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:
                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Exam.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Exam.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:
                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        getProfile: function () {
            $.ajax({
                url: Exam.urls.ROS + "profile?token=" + Exam.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Exam.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.user-notify-content h6[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        $('.user-notify-content p[data-type="role"]').text(user.role.value[Exam.lang]);
                                        $('.user-notify-content p[data-type="org"]').text(user.structure.name[Exam.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Exam.lang]);
                                        $('.main-img img').attr('src', Exam.urls.AdminRest + 'users/' + user.id + '/image?token=' + Exam.token);
//                                        $('.side-title-block img').attr('src', Exam.urls.HSIS + 'structures/1000001/logo?token=' + Exam.token);
                                        $('.side-title-block img').attr('src', Exam.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Exam.token);
                                        var img = $('.main-img img');
                                        img.on('error', function (e) {
                                            $('.main-img img').attr('src', 'assets/img/guest.png');
                                        });

                                        // $('.logo-name').text(user.orgName.value[Exam.lang]);
                                        // $('.main-img').attr('src', Exam.urls.AdminRest + 'users/' + user.id + '/image?token=' + Exam.token);
                                        // $('.org-logo').attr('src', Exam.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Exam.token);
                                        // var img = $('.main-img');
                                        // img.on('error', function (e) {
                                        //     $('.main-img').attr('src', 'assets/img/guest.png');
                                        // })
                                        $('div.big-img img').attr('src', Exam.urls.AdminRest + 'users/' + user.id + '/image?token=' + Exam.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Exam.structureId = user.structure.id;
                                    }
                                } catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Exam.statusCodes.UNAUTHORIZED:
                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Exam.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Exam.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    operations = data.data;
                                    Exam.operationList = operations;
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:
                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                    if ($('#buttons_div').find('ul li').length < 1) {
                        $('#buttons_div').hide();
                        console.log('empty')
                    }
                }
            });
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Exam.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Exam.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadDictionariesListByParentId: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Exam.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Exam.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Exam.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        loadEduType: function (callback) {
            $.ajax({
                url: Exam.urls.EMS + 'eduplan/?token=' + Exam.token + '&pageSize=1000000',
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data)
                                    }

                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        getEducationPlanDetails: function (id, orgId, callback) {
            $.ajax({
                url: Exam.urls.EMS + 'eduplan/' + id + '?token=' + Exam.token + '&orgId=' + orgId,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Exam.statusCodes.OK:

                                if (callback)
                                    callback(data)
                                break;

                            case Exam.statusCodes.UNAUTHORIZED:

                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },

        loadDictionariesByParentCode: function (parentCode, callback) {
            var form = {
                parentCode: parentCode
            }
            $.ajax({
                url: Exam.urls.AdminRest + 'settings/dictionaries/type?token=' + Exam.token,
                type: 'GET',
                data: form,
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data)
                                    }

                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        loadSubjects: function (callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'exam/subjects?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data)
                                    }
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });

        },
        loadQuestions: function (page, params, callback) {

            $.ajax({
                url: Exam.urls.ExamRest + 'questions?token=' + Exam.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                   
                                    Exam.Service.parseQuestions(result.data, page);
                                     if (callback) {
                                        callback(result.data);
                                    }
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });

        },

        loadQuestionsForExam: function (page, params, callback) {

            $.ajax({
                url: Exam.urls.ExamRest + 'questions?token=' + Exam.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data);
                                    }
                                    // Exam.Service.parseQuestions(result.data, page);
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });

        },
        getTopics: function (subjectId, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/topics/subject/' + subjectId + '?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Exam.statusCodes.OK:
                                    if (callback) {
                                        callback(result.data);
                                    }
                                    break;

                                case Exam.statusCodes.ERROR:
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Exam.statusCodes.UNAUTHORIZED:

                                    window.location = Exam.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });

        },

        addQuestion: function (formData, callback) {
            var question = {};
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/add?token=' + Exam.token,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
//                    $('#main-div #question_add').attr('disabled', 'disabled');

                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:
                                $.notify(Exam.dictionary[Exam.lang]['success'], {
                                    type: 'success'
                                });
                                question = result.data;
                                if (callback) {
                                    callback(question);
                                }
                                break;
                            case Exam.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Exam.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Exam.statusCodes.UNAUTHORIZED:
                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },

        updateQuestion: function (id, formData, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/' + id + '/update',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    $('#main-div #question_edit').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:
                                $.notify(Exam.dictionary[Exam.lang]['success'], {
                                    type: 'success'
                                });
                                if (callback)
                                    callback(result);

                                break;
                            case Exam.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Exam.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Exam.dictionary[Exam.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Exam.statusCodes.UNAUTHORIZED:
                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function (jqXHR, textStatus) {
                    $('#main-div #question_edit').removeAttr('disabled');
                }
            });
        },

        getEducationPlanSubjectTopic: function (id, eduplanSubjectId, callback) {
            $.ajax({
                url: Exam.urls.EMS + 'eduplan/' + id + '/subject/topic?token=' + Exam.token + '&eduplanSubjectId=' + eduplanSubjectId,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.ERROR:
                                $.notify("Xəta baş verdi!", {
                                    type: 'danger'
                                });
                                break;

                            case Exam.statusCodes.OK:
                                if (callback)
                                    callback(data)
                                break;

                            case Exam.statusCodes.UNAUTHORIZED:

                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                }
            });
        },

        getUnreadNotification: function (callback) {
            $.ajax({
                url: Exam.urls.COMMUNICATION + 'notification/unread/count?token=' + Exam.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Exam.statusCodes.OK:

                                callback(result);
                                break;

                            case Exam.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Exam.statusCodes.ERROR:
                                $.notify(Exam.dictionary[Exam.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Exam.statusCodes.UNAUTHORIZED:
                                window.location = Exam.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },

        addImageToQuestion: function (id, formData, callback) {
            $.ajax({
                url: Exam.urls.ExamRest + 'questions/' + id + '/add',
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Exam.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Exam.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            })
        },
    },

    Service: {
        parseApplications: function (applications) {
            var html = '';
            $.each(applications, function (i, v) {
                html += '<div class="col-md-4 p-l-0" title = "' + v.name[Exam.lang] + '">' +
                        '<li class="button-item">' +
                        '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Exam.token + '">' +
                        '<div class="flex-center">' + '<div class="' + v.iconPath + '"></div>' +
                        '<span class="button-name">' + v.shortName[Exam.lang] + '</span>' +
                        '</div>' +
                        '</a>' +
                        '</li>' +
                        '</div>';
            });

            $('#application-list .div-application').html(html);
        },
        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if (v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Exam.lang] + '">' +
                                '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Exam.token + '">' + v.shortName[Exam.lang] + '</a>' +
                                '</li>';
                });
                Exam.Proxy.loadSubApplications(function (data) {
                    if (data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Exam.lang] + '">' +
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Exam.token + '">' + v.shortName[Exam.lang] + '</a>' +
                                    '</li>';
                        })
                    }

                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Exam.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    var moduleListItems = $('body').find('.app-con li');
//                    console.log(moduleListItems)
                    if (moduleListItems.length > 5) {
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    } else {
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }
                })

            }

        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li data-code="' + v.code + '" title="' + v.name[Exam.lang] + '" data-id="' + v.id + '" class="module-block">' +
                                '<a class="icon-' + v.iconPath + '" >' + v.shortName[Exam.lang] +
                                '</a></li>';
                    }

                });
//                html += '<li title="" class="module-block"><a href="exam.html">Imtahan ver</a></li>';
            }

            return html;
        },
        parseOperations: function (operations, type, $obj, callback) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="assets/img/upd/table-dots.svg">' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a data-id="' + v.id + '" id="operation_' + v.code + '" href="#" >' + v.name[Exam.lang] + '</a></li>';

                        } else if (type == '2') {
                            if ($obj) {
                                html += '<li><a id="operation_' + v.id + '" href="#">' + v.name[Exam.lang] + '</a></li>';
                            } else {
                                html += '<li><a id="operation_' + v.id + '"  href="#">' + v.name[Exam.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }

            }
            return html;
        },
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Exam.dictionary[Exam.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Exam.lang] + '</option>';
                });

            }
            return html;
        },

        parseExam: function (data, page) {

            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#exam_list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data.data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.name + '</td>' +
                            '<td>' + v.typeId.value[Exam.lang] + '</td>' +
                            '<td>' + v.questCount + '</td>' +
                            '<td>' + v.code + '</td>' +
                            '<td>' + v.duration + '</td>' +
                            '<td>' + v.date + '</td>' +
                            '</tr>';

                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="exam" class="btn loading-margins btn-load-more">' + Exam.dictionary[Exam.lang]["load.more"] + '</button>');
                }


                if (page) {
                    $('#main-div').find('#exam_list tbody').append(html);
                } else {
                    $('#main-div').find('#exam_list tbody').html(html);
                }

            }
        },

        parseTickets: function (data, page) {

            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#ticket_list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    
                    html += '<tr data-id="' + v.id + '" data-note = "' + v.ticketNote + '">' +

                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.id + '</td>' +
                            '<td>' + v.eduPlanId.value[Exam.lang] + '</td>' +
                            '<td>' + v.subjectId.value[Exam.lang] + '</td>' +
                            '<td><div class="type_2_btns">' + Exam.Service.parseOperations(Exam.operationList, '2') +'</div></td>' +
                            '</tr>'
                   
                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="tickets" class="btn loading-margins btn-load-more">' + Exam.dictionary[Exam.lang]["load.more"] + '</button>');
                }


                if (page) {
                    $('#main-div').find('#ticket_list tbody').append(html);
                } else {
                    $('#main-div').find('#ticket_list tbody').html(html);
                }

            }
        },

        parseTicketQuestions: function (data, page) {

            if (data) {
                var noteForPage = $('body').attr('data-note');
                var html = '';
                var count;

                if (page) {
                    count = $('#ticket_questions tbody tr').length;
                } else {
                    count = 0;
                }
                
                $.each(data, function (i, v) {

                    html += '<div data-id="' + v.id + '">' +
                            '<div class = "count_of_questions_of_tickets">' + (++count) + '.</div>' +
                            '<div class = "quest-content"><div data-path = "'+ v.filePath +'">' + v.content + '</div>' +
                            '<div class = "ticket-image"><img class = "imageofquestinticket" src =' + Exam.urls.ExamRest + '/questions/file/' + v.filePath + '/?token=' + Exam.token + '></div>' +           
                            '</div></div>';
                    
                    $('body').find('.ticket-code').text(v.id);
                    $('body').find('.ticket-faculty').text(v.faculty.value[Exam.lang]);
                    $('body').find('.department_span').text(v.department.value[Exam.lang]);
                    $('body').find('.ticket-group').text(v.course.value[Exam.lang]);
                    $('body').find('.ticket-edu-year').text(v.eduYear.value[Exam.lang] + ' tədris ili')
                    $('body').find('.ticket-edu-part').text(v.eduPart.value[Exam.lang])
                    $('body').find('.ticket-subject').text(v.subject.value[Exam.lang])
                });
                $('.btn-load-more').removeAttr('data-page');
                $('body').find('img.imageofquestinticket').on('error', function () {
                    // $(this).attr('src','http://anl.az/new/images/book.png');
                    $(this).addClass('hidden')
                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="questions" class="btn loading-margins btn-load-more">' + Exam.dictionary[Exam.lang]["load.more"] + '</button>');
                }


                if (page) {
                    $('#main-div').find('.tickets').append(html);
                } else {
                    $('#main-div').find('.tickets').html(html);
                }
                $('body').find('.add-new .panel-footer .ticket-note').html(noteForPage);
                $('body').find('.imageofquestinticket').error(function () {
                    $(this).hide(); 
                });
            }
        },

            parseQuestions: function (data, page) {

            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#question_list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" question-content="' + v.content + '">' +
                            '<td>' + (++count) + '</td>' +
//                            '<td>' + v.content.substring(0, 50) + '</td>' +
                            '<td>' + v.topic.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.subject.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.eduPlan.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.level.value[Exam.lang] + '</td>' +
                            '<td>' + v.questionType.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.eduLevel.value[Exam.lang] + '</td>' +
                            '</tr>';

                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="questions" class="btn loading-margins btn-load-more">' + Exam.dictionary[Exam.lang]["load.more"] + '</button>');
                    
                }
                $('.btn-load-more').removeAttr('data-page');
                if (page) {
                    $('#main-div').find('#question_list tbody').append(html);
                } else {
                    $('#main-div').find('#question_list tbody').html(html);
                }
                $('body').find('.btn-load-more').prop('disabled', false);

            }
        },
        
            parseExamList: function (data, page) {

            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('#exam_list tbody tr').length;
                } else {
                    count = 0;
                }
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" >' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.subject.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.course.value[Exam.lang].substring(0, 70) + '</td>' +
                            '<td>' + v.examStartDate + '-' + v.examFinishDate + '</td>' +
                            '<td>' + v.examStartTime + '-' + v.examFinishTime + '</td>' +
                            '<td>' + v.examDuration + '</td>' +
                            '</tr>';

                });
                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="examlist" class="btn loading-margins btn-load-more">' + Exam.dictionary[Exam.lang]["load.more"] + '</button>');
                    
                }
                $('.btn-load-more').removeAttr('data-page');
                if (page) {
                    $('#main-div').find('#exam_list tbody').append(html);
                } else {
                    $('#main-div').find('#exam_list tbody').html(html);
                }
                $('body').find('.btn-load-more').prop('disabled', false);

            }
        },
    },
    Validation: {
        validateEmail: function (email) {
            var re = Exam.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Exam.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Exam.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Exam.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Exam.dictionary[Exam.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            } else {

                return false;
            }
        }
    },

    WebSocket: {

        connect: function () {
            var name = $('.namename').val();
            var socket = new SockJS(Exam.urls.SOCKET + '/chat');
            Exam.stompClient = Stomp.over(socket);
            Exam.stompClient.connect({'Login': Exam.token}, function (frame) {
                var sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
                Exam.stompClient.subscribe('/topic/messages/' + sessionId, function (messageOutput) {
                    $('body .notification').removeClass('hidden');

                });
            });
        },

        disconnect: function (a) {
            if (Exam.stompClient != 0) {
                Exam.stompClient.disconnect();
            }
            if (a == 1) {
                Exam.WebSocket.connect();
            }
        },
    },

};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Exam.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Exam.REGEX.TEXT + '|' + Exam.REGEX.PDF + '|' + Exam.REGEX.XLS + '|' + Exam.REGEX.XLSX + '|' + Exam.REGEX.DOC + '|' + Exam.REGEX.DOCX + '|' + Exam.REGEX.IMAGE_EXPRESSION + ')$'
};