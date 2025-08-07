import {RouterModule, Routes} from '@angular/router'
import {NotFoundComponent} from "./not-found/not-found.component";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {DisplayComponent} from "./display/display.component";
import {DisclaimerComponent} from "./disclaimer/disclaimer.component";
import {PrivacyComponent} from "./privacy/privacy.component";
import {TutorialComponent} from "./tutorial/tutorial.component";
import {SubmitDatasetComponent} from "./submit/submit-dataset/submit-dataset.component";
import {SubmitMetaComponent} from "./submit/submit-meta/submit-meta.component";
import {DocsumComponent} from "./docsum/docsum.component";


const routes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'display', component: DisplayComponent},
  {path: 'docsum', component: DocsumComponent},
  {path: 'tutorial', component: TutorialComponent},
  {path: 'disclaimer', component: DisclaimerComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'pre-submission-inquiry', component: SubmitMetaComponent},
  {path: 'submit-rds-file/:submission_id', component: SubmitDatasetComponent},

  // Not Found
  {path: '**', pathMatch: 'full', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
