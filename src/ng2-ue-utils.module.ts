import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { NgModule }             from '@angular/core';

import { Filtering }            from './components/filtering/filtering';
import { HintScroll }           from './components/hint-scroll/hint-scroll';
import { ListHeaders }          from './components/list-headers/list-headers';
import { LoadingDots }          from './components/loading-dots/loading-dots';
import { Modal }                from './components/modal/modal';
import { Notification }         from './components/notification/notification';
import { Pagination }           from './components/pagination/pagination';
import { Progress }             from './components/progress/progress';
import { ValueHandler }         from './components/value-handler/value-handler';
import { Tooltip }              from './components/tooltip/tooltip';
import { FocusOnInit }          from './directives/focus-on-init/focus-on-init';
import { ToggleOnHover }        from './directives/toggle-on-hover/toggle-on-hover';
import { TooltipDirective }     from './directives/tooltip/tooltip';
import { DateMoment }           from './pipes/date-moment/date-moment';
import { FromNow }              from './pipes/from-now/from-now';
import { DatePicker }           from './components/datepicker/datepicker';
import { DatePickerInput }      from './components/datepicker-input/datepicker-input';

@NgModule({
    declarations: [
        Filtering,
        HintScroll,
        ListHeaders,
        LoadingDots,
        Modal,
        Notification,
        Pagination,
        Progress,
        ValueHandler,
        FocusOnInit,
        ToggleOnHover,
        Tooltip,
        TooltipDirective,
        DateMoment,
        FromNow,
        DatePicker,
        DatePickerInput
    ],
    exports: [
        Filtering,
        HintScroll,
        ListHeaders,
        LoadingDots,
        Modal,
        Notification,
        Pagination,
        Progress,
        ValueHandler,
        FocusOnInit,
        ToggleOnHover,
        Tooltip,
        TooltipDirective,
        DateMoment,
        FromNow,
        DatePicker,
        DatePickerInput
    ],
    imports: [
        CommonModule,
        FormsModule
    ]

})
export class Ng2UEUtilsModule {}
