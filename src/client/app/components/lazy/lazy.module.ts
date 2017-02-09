import { NgModule } from '@angular/core';

import { LazyRoutingModule } from './lazy-routing.module';
import { LazyComponent } from './lazy.component';

@NgModule({
  imports: [LazyRoutingModule],
  declarations: [LazyComponent]
})
export class LazyModule {}