import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ToastService } from '../services/toast.service';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpErrorInterceptor])), provideHttpClientTesting()]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should handle backend ErrorResponse message', () => {
    let capturedError: unknown;

    httpClient.get('/api/v1/products/99').subscribe({
      error: (error: unknown) => {
        capturedError = error;
      }
    });

    const request = httpTestingController.expectOne('/api/v1/products/99');
    request.flush(
      {
        timestamp: '2024-01-01T00:00:00.000Z',
        status: 404,
        error: 'Not Found',
        message: 'Product not found',
        path: '/api/v1/products/99'
      },
      { status: 404, statusText: 'Not Found' }
    );

    expect(capturedError).toEqual(jasmine.any(HttpErrorResponse));
    expect(toastService.toasts()).toEqual([
      {
        id: 1,
        type: 'error',
        message: 'Product not found'
      }
    ]);
  });

  it('should handle network error status 0', () => {
    httpClient.get('/api/v1/alerts').subscribe({
      error: () => undefined
    });

    const request = httpTestingController.expectOne('/api/v1/alerts');
    request.error(new ProgressEvent('error'));

    expect(toastService.toasts()).toEqual([
      {
        id: 1,
        type: 'error',
        message: 'Inventory service no se encuentra disponible, favor intente mas tarde o informenos en la mesa de trabajo.'
      }
    ]);
  });
});
