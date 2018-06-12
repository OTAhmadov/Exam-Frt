/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Exam.lang;
    } else {
        chosenLang = Exam.getCookie('lang');
    }

    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('body').on('click', '.hide-menu', function () {
        $('.app-list').stop().slideToggle();
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        } catch (err) {
            console.error(err);
        }

    });

    if (Exam.token == '0') {
        Exam.initToken('tk');
    }


    Exam.loadLanguagePack('az');
    Exam.loadLanguagePack('en');
    Exam.loadLanguagePack('ru');

    setTimeout(function () {
        Exam.i18n();
        $.fn.datepicker.defaults.language = Exam.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Exam.dictionary[Exam.lang]['ok'],
            cancelButton: Exam.dictionary[Exam.lang]['close'],
            title: Exam.dictionary[Exam.lang]['warning']
        });
    }, 1000)



    $('#logoutForm').attr("action", Exam.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Exam.token);

    Exam.Proxy.getProfile();

    Exam.Proxy.loadApplications();

    $('.get_notification_page').attr('href', Exam.urls.NOTIFICATION + Exam.token);


    Exam.Proxy.loadModules(function (modules) {
        $('ul.module .mod-con').prepend(Exam.Service.parseModules(modules));
        $('.module-list').html(Exam.Service.parseModules(modules));
        var currModule = Exam.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Exam.Service[localStorage.button]();
            localStorage.removeItem('button');

        } else {
            if (currModule != "") {
                Exam.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Exam.currModule + '"] a');

                if (module.length) {
                    module.click();
                } else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            } else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });

    $('ul.module-list').on('click', '.module-block a', function (e) {
        NProgress.done();
        NProgress.remove();
        var obj = $(this).parents('li');
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        var code = obj.attr('data-code');
        // $('.module-list').find('.sub-module-con').fadeOut(1);
        $('ul.module-list').find('li').removeClass('active');
        // $(this).parents('li').find('.sub-module-con').fadeIn();
        // $('.module-list').find('.sub-module-con').remove();
        $(this).parents('li').addClass('active');
        try {

            if (obj.attr('data-check') !== '1') {
                NProgress.start();
                Exam.currModule = obj.attr('data-id');
                document.cookie = "currModule=" + Exam.currModule;


                $('.main-content-upd').load('partials/module_' + id + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: code}, null, '#' + title);
                    $('ul.module-list').find('li').removeAttr('data-check');
                    obj.attr('data-check', 1);

                });
            } else {
                return false
            }

        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1001390', function () {
        try {

            var id = $('body').attr('data-id')

            $('body .add-new .search-scroll').load('partials/question_edit.html', function () {


                Exam.Proxy.loadDictionariesByParentCode(Exam.Codes.QUESTION_TIPI, function (questionTipi) {
                    if (questionTipi) {
                        var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                        $.each(questionTipi, function (i, v) {
                            html += '<option code="' + v.code + '" value = "' + v.id + '">' + v.value[Exam.lang] + '</option>'
                        });
                        $('#quest_tipi').html(html);
                    }
                    Exam.Proxy.loadDictionariesByParentCode(Exam.Codes.QUESTION_LEVEL, function (questionLevel) {
                        if (questionLevel) {
                            var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                            $.each(questionLevel, function (i, v) {
                                html += '<option value = "' + v.id + '">' + v.value[Exam.lang] + '</option>'
                            });
                            $('#quest_level').html(html);

                        }
                        Exam.Proxy.loadDictionariesByParentCode(Exam.Codes.QUESTION_TYPE, function (questionType) {
                            if (questionType) {
                                var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                $.each(questionType, function (i, v) {
                                    html += '<option code="' + v.code + '" value = "' + v.id + '">' + v.value[Exam.lang] + '</option>'
                                });
                                $('#quest_type').html(html);
                            }
                            Exam.Proxy.loadDictionariesByParentCode(Exam.Codes.EDU_LANG, function (eduLang) {
                                if (eduLang) {
                                    var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                    $.each(eduLang, function (i, v) {
                                        html += '<option value = "' + v.id + '">' + v.value[Exam.lang] + '</option>'
                                    });
                                    $('#quest_lang').html(html);
                                }
                                Exam.Proxy.loadDictionariesByParentCode(Exam.Codes.EDU_LEVEL, function (eduLevel) {
                                    if (eduLevel) {
                                        var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                        $.each(eduLevel, function (i, v) {
                                            html += '<option value = "' + v.id + '">' + v.value[Exam.lang] + '</option>'
                                        });
                                        $('#quest_edu_level').html(html);
                                    }

                                    Exam.Proxy.getQuestionDetails(id, function (data) {
                                        if (data) {

                                            $('body').find('#quest_level').val(data.level.id)
                                            $('body').find('#quest_type').val(data.questionType.id)
                                            $('body').find('#quest_edu_level').val(data.eduLevel.id)
                                            $('body').find('#quest_lang').val(data.language.id);
                                            $('body').find('#quest_tipi').val(data.tipi.id);
                                            Exam.Proxy.loadEduType(function (data2) {
                                                if (data2) {
                                                    var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                                    $.each(data2, function (i, v) {
                                                        html += '<option value = "' + v.id + '">' + v.name + '</option>'
                                                    });
                                                    $('#edu_plan').html(html);
                                                    $('#edu_plan').val(data.eduPlan.id)
                                                }
                                            });
                                            Exam.Proxy.getEducationPlanDetails(data.eduPlan.id, '', function (data2) {
                                                if (data) {
                                                    var result = data2.data.allSubjects
                                                    var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                                    $.each(result, function (i, v) {
                                                        html += '<option value="' + v.id + '">' + v.dicName.value['az'] + '</option>';
                                                    });
                                                    $('#quest_subject').html(html);
                                                    $('#quest_subject').val(data.subject.id);
                                                }
                                            });
                                            Exam.Proxy.getEducationPlanSubjectTopic(data.eduPlan.id, data.subject.id, function (topics) {
                                                if (topics) {
                                                    var html = '<option value="">' + Exam.dictionary[Exam.lang]['select'] + '</option>';
                                                    $.each(topics.data, function (i, v) {
                                                        html += '<option value="' + v.id + '">' + v.topicName + '</option>';
                                                    });
                                                    $('#quest_topic').html(html);
                                                    $('#quest_topic').val(data.topic.id);
                                                }
                                            });
                                            var parent_image_tab = $(".first-image-tab");
                                            if (data.fileWrapper.id) {
                                                parent_image_tab.find(".remove-image").attr('data-path', data.fileWrapper.path)
                                            } else {
                                                $('.qimage').addClass('hidden');
                                                $('.quest-pic-img').removeClass('hidden');
                                            }

                                            if (data.fileWrapper.path != null && data.fileWrapper.path != undefined && data.fileWrapper.path != '') {
                                                parent_image_tab.find(".image_uploader_label").addClass("hidden");
                                                parent_image_tab.find(".image_uploader_after").removeClass('hidden');
                                                parent_image_tab.find(".image_uploader_after img").attr("src", Exam.urls.ExamRest + '/questions/file/' + data.fileWrapper.path + '/?token=' + Exam.token);
                                            } else {
                                                parent_image_tab.find(".image_uploader_label").removeClass("hidden");
                                                parent_image_tab.find(".image_uploader_after").addClass("hidden")
                                            }



                                            setTimeout(function () {
                                                CKEDITOR.instances.quest_content.setData(data.content);
                                            }, 200);

                                            var questType = $('#quest_type').find('option:selected').attr('code');
                                            var inputType = '';
                                            switch (questType) {
                                                case "ONE_CHOISE":
                                                    inputType = "radio";
                                                    break;
                                                case "MULTIPLE_CHOISE":
                                                    inputType = "checkbox";
                                                    break;

                                            }

                                            if (questType != "") {
                                                $('input[name="rightChoise"]').each(function (i, v) {
                                                    if ($(this).is(':checked')) {
                                                        $(this).prop('checked', false);
                                                    }
                                                    $(this).attr('type', inputType);
                                                });
                                            }

                                            if (questType == "OPEN_QUEST") {
                                                $('.question_choises').addClass('hidden');
                                            } else {
                                                $('.question_choises').removeClass('hidden');
                                                $.each(data.choises, function (i, v) {
                                                    var count = 0;
                                                    $('#main-div .variant-item').each(function () {

                                                        var id = $(this).find('textarea').attr('data-id');

                                                        if (!id && count == 0) {

                                                            ++count;
                                                            $(this).find('.answer').attr('data-id', v.id)
                                                            if (v.rightChoise == 0) {
                                                                $(this).find('.answer').removeAttr('checked')
                                                            } else {
                                                                $(this).find('.answer').attr('checked', 'checked');
                                                            }
                                                            $(this).find('textarea').attr('data-id', v.id)
                                                            $(this).attr('data-id', v.id)
                                                            $(this).find('textarea').val(v.questionContent);


                                                            var parent_image_tab = $(this);
                                                            if (v.fileWrapper.path != null && v.fileWrapper.path != undefined && v.fileWrapper.path != '') {
                                                                parent_image_tab.find(".image_uploader_label").addClass("hidden");
                                                                parent_image_tab.find(".image_uploader_after").removeClass('hidden');
                                                                parent_image_tab.find(".image_uploader_after img").attr("src", Exam.urls.ExamRest + '/questions/file/' + v.fileWrapper.path + '/?token=' + Exam.token);
                                                            } else {
                                                                parent_image_tab.find(".image_uploader_label").removeClass("hidden");
                                                                parent_image_tab.find(".image_uploader_after").addClass("hidden")
                                                            }
                                                            $(this).find('.remove-image').attr('data-path', v.fileWrapper.path)
                                                        }

                                                    })
                                                });
                                            }
                                        }

                                        $('body').find('.add-new').css('right', '0');
                                    });

                                });
                            });
                        });
                    });

                });


            });

        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1001389 ', function (e) {
        try {
            var questionId = $('body').attr('data-id');
            var params = $('.question-search-form').serialize();
            $.confirm({
                title: Exam.dictionary[Exam.lang]['warning'],
                content: Exam.dictionary[Exam.lang]['delete_info'],
                confirm: function () {
                    Exam.Proxy.removeQuestion(questionId, function () {
                        Exam.Proxy.loadQuestions('', params);
                    })
                },
                theme: 'black'
            });
            $('body').find('.col-sm-4.info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
        } catch (e) {
            console.error(e)
        }

    });

    $('body').on('click', '#operation_1001407 ', function (e) {
        try {
            var ticketId = $(this).parents('#ticket_list tbody tr').attr('data-id');
            var params = $('.ticket-search-form').serialize();
            $.confirm({
                title: Exam.dictionary[Exam.lang]['warning'],
                content: Exam.dictionary[Exam.lang]['delete_info'],
                confirm: function () {
                    Exam.Proxy.removeTicket(ticketId, function (e) {
                        Exam.Proxy.getTickets('', params);
                    })
                },
                theme: 'black'
            });
        } catch (e) {
            console.error(e)
        }

    });

    $('body').on('click', '#question_list tbody tr', function (e) {
        try {
            var questionId = $(this).attr('data-id')
            $('body').attr('data-id', questionId)
            Exam.Proxy.getQuestionDetails(questionId, function (data) {
                if (data) {

                    $('#question_content').html(data.content);
                }

            })

            $('.type_2_btns').html(Exam.Service.parseOperations(Exam.operationList, '2'));
            $('body').find('.col-sm-12.data').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.info').fadeIn(1).css('right', '0');
            $('body').find('#question_list tr').removeClass('active');
            $(this).addClass('active')
        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.panel-close', function () {
        $('body').find('.col-sm-4.info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $('#main-div').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var questParams = $('#main-div .question-search-form').serialize();
            var ticketParams = $('#main-div .ticket-search-form').serialize();

            $btn.prop('disabled', true);
            if (typeTable == 'questions') {
                Exam.Proxy.loadQuestions(page, questParams, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || data.length == 0) {
                        $btn.remove();
                    }
                });
            }else if (typeTable == 'tickets') {
                Exam.Proxy.getTickets(page, ticketParams, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || data.length == 0) {
                        $btn.remove();
                    }
                });
            }

        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.dropdown-filter a', function (e) {
        try {
            var text = $(this).text();
            $(this).parents('.btn-group').find('button span').text(text);
        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#back', function (e) {
        $('body').find('.add-new').css('right', '-100%');

        return false
    });

    $('#main-div').on('click', '#question_add', function (e) {
        try {
            if (Exam.Validation.validateRequiredFields('data-required')) {
                var allValid = true;
                var formData = new FormData();
                if (CKEDITOR.instances.quest_content.getData()) {
                    var question = {
                        subjectId: $('#quest_subject').val(),
                        eduPlanId: $('#edu_plan').val(),
                        eduLevelId: $('#quest_edu_level').val(),
                        questionLevelId: $('#quest_level').val(),
                        questionTypeId: $('#quest_type').val(),
                        topicId: $('#quest_topic').val(),
                        langId: $('#quest_lang').val(),
                        tipiId: $('#quest_tipi').val(),
                        content: CKEDITOR.instances.quest_content.getData(),
                        variants: [],
                        token: Exam.token
                    }
                } else {
                    $.notify('Sual məzmununu əlavə edin', {
                        type: 'warning'
                    });
                    return false;
                }


                var questionTypeCode = $('#quest_type').find('option:selected').attr('code');
                if (questionTypeCode != undefined && questionTypeCode != "OPEN_QUEST") {
                    if (Exam.Validation.validateRequiredFields('variant-required')) {
                        var inputType = $(".answer:input").attr('type');
                        var checkedCount = $(".answer:input:checked").length;
                        if (inputType == "radio") {
                            if (checkedCount == 0) {
                                $.alert({
                                    title: Exam.dictionary[Exam.lang]['warning'],
                                    content: Exam.dictionary[Exam.lang]['select_one'],
                                    theme: 'material'
                                });
                                allValid = false;
                            }
                        } else if (inputType == "checkbox") {
                            if (checkedCount <= 1) {
                                $.alert({
                                    title: Exam.dictionary[Exam.lang]['warning'],
                                    content: Exam.dictionary[Exam.lang]['select_two'],
                                    theme: 'material'
                                });
                                allValid = false;
                            }
                        }

                        var wrongFiles = ''
                        $('.variant-item').each(function (i, v) {
                            var variant = {
                                id: (++i),
                                content: $(this).find('textarea').val(),
                                rightChoise: $(this).find('.answer').is(':checked') ? true : false
                            }
                            question.variants.push(variant);

                            if ($(this).find('.variant_file')[0].files[0]) {
                                var file = $(this).find('.variant_file')[0].files[0];
                                console.log(file);
                                console.log('--');
                                if (Exam.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        $.notify(file.name + Exam.dictionary[Exam.lang]['exceed_volume'], {
                                            type: 'warning'
                                        });
                                        allValid = false;
                                    } else {
                                        formData.append('file_' + i, file);
                                    }
                                } else {
                                    wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;

                                }
                            }
                        });

                        if (wrongFiles != '') {
                            $.notify(Exam.dictionary[Exam.lang]['wrong_format'] + wrongFiles, {
                                type: 'warning'
                            });
                            allValid = false;
                        }

                    } else {
                        allValid = false;
                    }
                }

                formData.append('question', new Blob([JSON.stringify(question)], {
                    type: "application/json"

                }));

                if ($('#quest_file')[0].files[0]) {
                    var image = $('#quest_file')[0].files[0];
                    if (Exam.Validation.checkFile(image.type, fileTypes.IMAGE_CONTENT_TYPE)) {
                        formData.append('file', image);
                    } else {
                        $.notify(Exam.dictionary[Exam.lang]['wrong_format'] + image.name, {
                            type: 'warning'
                        });

                        allValid = false;
                    }
                }

                if (allValid) {
                    Exam.Proxy.addQuestion(formData, function () {
                        var params = $('.question-search-form').serialize();
//                            $('body').find('.add-new').css('right', '-100%');
                        CKEDITOR.instances.quest_content.setData()
                        Exam.Proxy.loadQuestions('', params);
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    });

    $(window).resize(function () {
        var width = window.innerWidth;
        if (width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click', '.hide-menu', function (e) {
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if (display === "none") {
                    $('.app-list').fadeIn();
                } else {
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click", function () {
                $('.app-list').hide();
            });
        }
    });

            $('#main-div').on('keypress', '#question_search', function (e) {
            try {

                if (e.keyCode == 13) {
                    var keyword = $('#question_search').val();

                    if (keyword.trim().length > 2) {
                        $('.btn-load-more').removeAttr('data-page');
                        $('.question-search-form input[name="keyword"]').val(keyword);
                        var queryparams = $('.question-search-form').serialize();
                        Exam.Proxy.loadQuestions('', queryparams);
                    }
                    else if (keyword.trim().length == 0) {
                        $('.btn-load-more').removeAttr('data-page');
                        $('.question-search-form input[name="keyword"]').val('');
                        var params = $('.question-search-form').serialize();
                        Exam.Proxy.loadQuestions('', params);
                    }
                }

            }
            catch (err) {
                console.error(err);
            }
        });

    $('#main-div').on('click', '#question_edit', function (e) {
        try {
            if (Exam.Validation.validateRequiredFields('data-required')) {
                var allValid = true;
                var formData = new FormData();
                var questionId = $('body').attr('data-id');
                var question = {
                    subjectId: $('#quest_subject').val(),
                    eduPlanId: $('#edu_plan').val(),
                    eduLevelId: $('#quest_edu_level').val(),
                    questionLevelId: $('#quest_level').val(),
                    questionTypeId: $('#quest_type').val(),
                    topicId: $('#quest_topic').val(),
                    langId: $('#quest_lang').val(),
                    tipiId: $('#quest_tipi').val(),
                    content: CKEDITOR.instances.quest_content.getData(),
                    variants: [],
                    token: Exam.token
                }

                var questionTypeCode = $('#quest_type').find('option:selected').attr('code');
                if (questionTypeCode != undefined && questionTypeCode != "OPEN_QUEST") {
                    if (Exam.Validation.validateRequiredFields('variant-required')) {
                        var inputType = $(".answer:input").attr('type');
                        var checkedCount = $(".answer:input:checked").length;
                        if (inputType == "radio") {
                            if (checkedCount == 0) {
                                $.alert({
                                    title: Exam.dictionary[Exam.lang]['warning'],
                                    content: Exam.dictionary[Exam.lang]['select_one'],
                                    theme: 'material'
                                });
                                allValid = false;
                            }
                        } else if (inputType == "checkbox") {
                            if (checkedCount <= 1) {
                                $.alert({
                                    title: Exam.dictionary[Exam.lang]['warning'],
                                    content: Exam.dictionary[Exam.lang]['select_two'],
                                    theme: 'material'
                                });
                                allValid = false;
                            }
                        }

                        $('.variant-item').each(function (i, v) {
                            var variant = {
                                id: $(this).find('textarea').attr('data-id'),
                                content: $(this).find('textarea').val(),
                                rightChoise: $(this).find('.answer').is(':checked') ? true : false
                            }
                            question.variants.push(variant);

                        });

                    } else {
                        allValid = false;
                    }
                }

                formData.append('question', new Blob([JSON.stringify(question)], {
                    type: "application/json"

                }));

                if (allValid) {
                    Exam.Proxy.updateQuestion(questionId, formData, function (data) {
                        if (data) {
                            var params = $('.question-search-form').serialize();
                            $('body').find('.add-new').css('right', '-100%');
                            Exam.Proxy.loadQuestions('', params);
                            $('body').find('.col-sm-4.info').fadeOut();
                            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                        }

                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1001406', function (e) {
        try {
            var id = $(this).parents('#ticket_list tbody tr').attr('data-id');
            var note = $(this).parents('#ticket_list tbody tr').attr('data-note');
            $('body').attr('data-note', note);
            Exam.Proxy.loadTicketQuestions(id);
            $('body .add-new .search-scroll').load('partials/ticket_for_pdf.html');
            $('body').find('.add-new').css('right', '0');
        } catch (err) {
            console.error(err);
        }
    });

//        $('body').on('click', '.qimage', function (e) {
    $('body').on('click', '.remove-image', function (e) {

        var path = $(this).attr('data-path');
        $.confirm({
            title: Exam.dictionary[Exam.lang]['warning'],
            content: Exam.dictionary[Exam.lang]['delete_info'],
            confirm: function () {
                Exam.Proxy.removeFile(path);
//                $(this).find('.quest_file').val('');
//                $(this).find('.quest_pic').attr('src', '');
//                $(this).addClass('hidden');
//                $(this).find('.quest-pic-img').removeClass('hidden');

            },
            theme: 'black'
        });

        return false;
    });

    $('body').on('click', '.add-ticket #add_ticket', function () {
        var params = $('.ticket-search-form').serialize();
        if (Exam.Validation.validateRequiredFields('ticket-required')) {
            if ($('body').find('#append_res_param .res-edition-item').length > 0) {
                try {
                    var formData = new FormData();
                    var question = {
                        ticketDepartment: $('#department_filter').val(),
                        ticketFaculty: $('#org_faculty_filter').val(),
                        ticketGroup: $('#group').val(),
                        ticketCount: $('#ticket_count').val(),
                        questNote: $('#ticket_note').val(),
                        questTopic: $('#quest_topic').val(),
                        eduPlanId: $('#edu_plan').val(),
                        subjectId: $('#quest_subject').val(),
                        structure: [],
                        token: Exam.token
                    };
                    $('.res-edition-item').each(function (i, v) {
                        var tr = $(this).find('tbody tr');
                        question.structure.push(
                                {
                                    questSpec: tr.attr('data-quest-spec'),
                                    questDifficulity: tr.attr('data-quest-difficulity'),
                                    questType: tr.attr('data-quest-type'),
                                    questCount: tr.attr('data-quest-count'),
                                    language: tr.attr('data-quest-language'),
                                }
                        );
                    });
                    formData.append('question', new Blob([JSON.stringify(question)], {type: "application/json"}));
                    Exam.Proxy.addTicket(formData, function () {    
                        Exam.Proxy.getTickets('', params);
                    });

                } catch (err) {
                    console.error(err);
                }

            } else {
                $.notify("Sual strukturunu seçin", {
                    type: 'danger'
                });
            }
        } else {
            return false;
        }
    });

    $('body').on('change', '.quest-pic-img', function () {
    });

    $('body').on('click', '.add-edition', function () {
        $('.resource-edition-modal').modal();
//        $('body').find('#quest_topic').select2("val", "", true);
        $('.resource-edition-modal').find('input').val('');
        $('.resource-edition-modal select').find('option:selected').prop('selected', false);
        $('body').find('.confirm-res-param').attr('data-type', 'add');
    });

    $('#main-div').on('click', '.add-page .confirm-res-param[data-type="add"]', function (e) {
        if (Exam.Validation.validateRequiredFields('data-ticket-required')) {

            try {

                var quesSpec = $('body').find('#quest_type').val();
                var questType = $('body').find('#quest_tipi').val();
                var questLang = $('body').find('#language').val();
                var questLangText = $('body').find('#language option:selected').text();
                var questDifficulity = $('body').find('#quest_difficulty').val();
                var quesSpecText = $('body').find('#quest_type option:selected').text();
                var questTypeText = $('body').find('#quest_tipi option:selected').text()
                var questDifficulityText = $('body').find('#quest_difficulty option:selected').text()
                var questCount = $('body').find('#quest_count_in_modal').val();

//                var questTopicText = "";
//                $("#quest_topic").find("option:selected").each(function() {
//                        questTopicText += $(this).text() + ",";
//                });
//                questTopicText = questTopicText.slice(0, -1);

                var html = '<div class="col-md-12 for-align res-edition-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>Sualın Növü</th>' +
                        '<th>Sualın Tipi</th>' +
                        '<th>Çətinlik dərəcəsi</th>' +
                        '<th>Dil</th>' +
                        '<th>Sual sayı</th>' +
//                        '<th>Mövzu</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-quest-language = "' + questLang + '" data-quest-spec="' + quesSpec + '" data-quest-type="' + questType + '" data-quest-difficulity = "' + questDifficulity + '" data-quest-count = "' + questCount + '">' +
                        '<td data-quest-spec>' + quesSpecText + ' </td>' +
                        '<td data-quest-typ>' + questTypeText + ' </td>' +
                        '<td data-quest-difficulity>' + questDifficulityText + ' </td>' +
                        '<td data-quest-language>' + questLangText + ' </td>' +
                        '<td data-quest-count>' + questCount + ' </td>' +
//                        '<td data-quest-topic>' + questTopicText + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a edit-question data-quest-language = "' + questLang + '" data-quest-spec="' + quesSpec + '" data-quest-type="' + questType + '" data-quest-difficulity = "' + questDifficulity + '" data-quest-count = "' + questCount + '" href="#" class="edit">' + Exam.dictionary[Exam.lang]['edit'] + '</a></li>' +
                        '<li><a delete-ticket href="#" class="erase">' + Exam.dictionary[Exam.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_res_param').append(html);
                $('.resource-edition-modal').modal('hide');
                $('.param-block').has('.blank-panel').children('.blank-panel').remove();
            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });

    $('#main-div').on('click', '.add-page .confirm-res-param[data-type="edit"]', function (e) {
        if (Exam.Validation.validateRequiredFields('data-ticket-required')) {
//            $('body').find('div.res-edition-item.selected').remove();
            try {

                var quesSpec = $('body').find('#quest_type').val();
                var questType = $('body').find('#quest_tipi').val();
                var questLang = $('body').find('#language').val();
                var questLangText = $('body').find('#language option:selected').text();
//                var questTopic = $('body').find('#quest_topic').val();
//                var questTopicText = $('body').find('#quest_topic option:selected').text();
                var questDifficulity = $('body').find('#quest_difficulty').val();
                var quesSpecText = $('body').find('#quest_type option:selected').text();
                var questTypeText = $('body').find('#quest_tipi option:selected').text()
                var questDifficulityText = $('body').find('#quest_difficulty option:selected').text()
                var questCount = $('body').find('#quest_count_in_modal').val();

//                var questTopicText = "";
//                $("#quest_topic").find("option:selected").each(function() {
//                        questTopicText += $(this).text() + ",";
//                });
//                questTopicText = questTopicText.slice(0, -1);

                var html = '<div class="col-md-12 for-align res-edition-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>Sualın Növü</th>' +
                        '<th>Sualın Tipi</th>' +
                        '<th>Çətinlik dərəcəsi</th>' +
                        '<th>Dil</th>' +
                        '<th>Sual sayı</th>' +
//                        '<th>Mövzu</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-quest-language = "' + questLang + '" data-quest-spec="' + quesSpec + '" data-quest-type="' + questType + '" data-quest-difficulity = "' + questDifficulity + '" data-quest-count = "' + questCount + '">' +
                        '<td data-quest-spec>' + quesSpecText + ' </td>' +
                        '<td data-quest-typ>' + questTypeText + ' </td>' +
                        '<td data-quest-difficulity>' + questDifficulityText + ' </td>' +
                        '<td data-quest-language>' + questLangText + ' </td>' +
                        '<td data-quest-count>' + questCount + ' </td>' +
//                        '<td data-quest-topic>' + questTopicText + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a edit-question data-quest-language = "' + questLang + '" data-quest-spec="' + quesSpec + '" data-quest-type="' + questType + '" data-quest-difficulity = "' + questDifficulity + '" data-quest-count = "' + questCount + '" href="#" class="edit">' + Exam.dictionary[Exam.lang]['edit'] + '</a></li>' +
                        '<li><a delete-ticket href="#" class="erase">' + Exam.dictionary[Exam.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_res_param .res-edition-item.selected').html(html);
//                $('#append_res_param').html(html);
                $('.resource-edition-modal').modal('hide');
                $('body').find('div.res-edition-item').removeClass('selected');
                $('.param-block').has('.blank-panel').children('.blank-panel').remove();
            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });
    
    $('#main-div').on('click', '[edit-question]', function (e) {
        try {
            var obj = $(this);
            obj.parents('div.res-edition-item').addClass('selected');
            var questCount = obj.attr('data-quest-count');
            var questLang = obj.attr('data-quest-language');
            var quesSpec = obj.attr('data-quest-spec');
            var questType = obj.attr('data-quest-type');
            var questDifficulity = obj.attr('data-quest-difficulity');
            var modal = $('body').find('.resource-edition-modal');
            var id = $(this).parents('.res-edition-item').find('tbody tr').attr('data-id');
            $('body').attr('data-question-structure-id', id);

            modal.modal();
            $('body').find('#quest_count_in_modal').val(questCount);
            $('body').find('#language').find('option[value="' + questLang + '"]').prop('selected', true);
            $('body').find('#quest_tipi').find('option[value="' + quesSpec + '"]').prop('selected', true);
            $('body').find('#quest_type').find('option[value="' + questType + '"]').prop('selected', true);
            $('body').find('#quest_difficulty').find('option[value="' + questDifficulity + '"]').prop('selected', true);

            $('body').find('.confirm-res-param').attr('data-type', 'edit');

        } catch (er) {
            console.error(er);
        }
    });

    $(document).on('click', '.add-page .dropdown-menu a.erase', function (e) {

        try {
            var obj = $(this);
            e.preventDefault();
            var parent = obj.parents('.res-edition-item')
            $.confirm({
                title: Exam.dictionary[Exam.lang]['warning'],
                content: Exam.dictionary[Exam.lang]['delete_info'],
                confirm: function () {
                    parent.remove();
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('change', '#edu_plan_select', function () {
        var eduPlanId = $(this).val();
        $('.ticket-search-form input[name="eduPlanId"]').val(eduPlanId);
        var params = $('.ticket-search-form').serialize();
        Exam.Proxy.getTickets('', params);
    });
    $('body').on('change', '#quest_subject_select', function () {
        var questSubjectId = $(this).val();
        $('.ticket-search-form input[name="subjectId"]').val(questSubjectId);
        var params = $('.ticket-search-form').serialize();
        Exam.Proxy.getTickets('', params);
    });
    $('body').on('change', '#group_filter', function () {
        var groupId = $(this).val();
        $('.ticket-search-form input[name="ticketGroup"]').val(groupId);
        var params = $('.ticket-search-form').serialize();
        Exam.Proxy.getTickets('', params);
    });
    $('body').on('change', '#org_faculty_filter_select', function () {
        var facultyId = $(this).val();
        $('.ticket-search-form input[name="ticketFaculty"]').val(facultyId);
        var params = $('.ticket-search-form').serialize();
        Exam.Proxy.getTickets('', params);
    });
    $('body').on('change', '#department_filter_select', function () {
        var departmentId = $(this).val();
        $('.ticket-search-form input[name="ticketDepartment"]').val(departmentId);
        var params = $('.ticket-search-form').serialize();
        Exam.Proxy.getTickets('', params);
    });


    $(".main-img").on("click", function () {
        $('.user-info').toggleClass("helloWorld");
    });
    

});

function ckeditors(editorName) {
    CKEDITOR.replace(editorName, {language: 'az'});
}

function setCkeditor() {
    if ($(".custom-ckeditor").length > 0) {
        $(".custom-ckeditor").each(function () {
            var id = $(this).attr("id");
            ckeditors(id);
        });
    }
}