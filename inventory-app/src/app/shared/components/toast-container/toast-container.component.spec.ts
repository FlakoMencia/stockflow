import { TestBed } from '@angular/core/testing';
import { ToastService } from '../../../core/services/toast.service';
import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastContainerComponent]
    });

    toastService = TestBed.inject(ToastService);
  });

  it('should render and dismiss toasts', () => {
    const fixture = TestBed.createComponent(ToastContainerComponent);

    toastService.success('Operation completed');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operation completed');

    const dismissButton = fixture.nativeElement.querySelector('.toast__dismiss') as HTMLButtonElement;
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });
});
