import { act, fireEvent, render, screen } from '@testing-library/react';

import BackToTop from '../BackToTop';


describe('BackToTop', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('does not render when scrollY <= 300', () => {
    render(<BackToTop />);
    expect(screen.queryByRole('button', { name: /back to top/i })).toBeNull();
  });

  it('renders button when scrollY > 300', () => {
    render(<BackToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 });
      fireEvent.scroll(window);
    });

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  it('scrolls to top smoothly when clicked', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500 });
      fireEvent.scroll(window);
    });

    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('removes scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<BackToTop />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
