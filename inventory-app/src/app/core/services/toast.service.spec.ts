import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should create a success toast', () => {
    const toastId = service.success('Product saved successfully');

    expect(toastId).toBe(1);
    expect(service.toasts()).toEqual([
      {
        id: 1,
        type: 'success',
        message: 'Product saved successfully'
      }
    ]);
  });

  it('should create an error toast', () => {
    service.error('Unable to register movement');

    expect(service.toasts()).toEqual([
      {
        id: 1,
        type: 'error',
        message: 'Unable to register movement'
      }
    ]);
  });

  it('should dismiss a toast', () => {
    const firstToastId = service.info('Information message');
    service.warning('Warning message');

    service.dismiss(firstToastId);

    expect(service.toasts()).toEqual([
      {
        id: 2,
        type: 'warning',
        message: 'Warning message'
      }
    ]);
  });
});
