import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertApiService } from './alert-api.service';

describe('AlertApiService', () => {
  let service: AlertApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AlertApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request alerts from the backend', () => {
    service.getAlerts().subscribe();

    const request = httpTestingController.expectOne('http://localhost:8080/api/v1/alerts');

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });
});
