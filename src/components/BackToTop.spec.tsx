import { render } from '@testing-library/react';


it('renders BackToTop component', () => {
  const { getByText } = render(<div>Back to Top</div>);
  expect(getByText('Back to Top')).toBeInTheDocument();
});