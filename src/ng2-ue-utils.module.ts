import { CommonModule }         from '@angular/common';
import { NgModule }             from '@angular/core';
import { Ng2BootstrapModule }   from 'ng2-bootstrap/ng2-bootstrap';

import { Filtering }            from './components/filtering/filtering';
import { HintScroll }           from './components/hint-scroll/hint-scroll';
import { ListHeaders }          from './components/list-headers/list-headers';
import { LoadingDots }          from './components/loading-dots/loading-dots';
import { Modal }                from './components/modal/modal';
import { Notification }         from './components/notification/notification';
import { Pagination }           from './components/pagination/pagination';
import { Progress }             from './components/progress/progress';
import { ValueHandler }         from './components/value-handler/value-handler';
import { FocusOnInit }          from './directives/focus-on-init/focus-on-init';
import { ToggleOnHover }        from './directives/toggle-on-hover/toggle-on-hover';
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
        DateMoment,
        FromNow,
        DatePicker,
        DatePickerInput
    ],
    imports: [
        CommonModule,
        Ng2BootstrapModule
    ]
})
export class Ng2UEUtilsModule {}
