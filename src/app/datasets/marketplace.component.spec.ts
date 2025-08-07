import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MarketplaceComponent} from './marketplace.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng-mocks";
import {DatasetSearchComponent} from "./dataset-search/dataset-search.component";

describe('MarketplaceComponent', () => {
    let component: MarketplaceComponent;
    let fixture: ComponentFixture<MarketplaceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
            declarations: [MarketplaceComponent,
                MockComponent(DatasetSearchComponent)
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MarketplaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
