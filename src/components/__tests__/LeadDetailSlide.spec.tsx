import { Lead } from '@models/leads';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LeadDetailSlide from '../LeadDetailSlide';


jest.mock('@utils/validators', () => ({
  isValidEmail: jest.fn((email: string) => email.includes('@')),
}));

const baseLead: Lead = {
  id: '1',
  name: 'John Doe',
  company: 'Acme Corp',
  email: 'john@example.com',
  source: 'Web',
  score: 50,
  status: 'New',
};

describe('LeadDetailSlide (no setTimeout tests)', () => {
  let onClose: jest.Mock;
  let onSave: jest.Mock;
  let onConvert: jest.Mock;

  beforeEach(() => {
    onClose = jest.fn();
    onSave = jest.fn().mockResolvedValue(undefined);
    onConvert = jest.fn();
    jest.clearAllMocks();
  });

  it('returns null when lead is null', () => {
    const { container } = render(
      <LeadDetailSlide lead={null} onClose={onClose} onSave={onSave} onConvert={onConvert} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders lead info (name, id, email, status select)', () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(baseLead.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(baseLead.status)).toBeInTheDocument();
  });

  it('shows validation error when email is invalid and disables Save', () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);
    const emailInput = screen.getByDisplayValue(baseLead.email);
    fireEvent.change(emailInput, { target: { value: 'bad-email' } });

    // Validation message appears immediately
    expect(screen.getByText(/Invalid email format/)).toBeInTheDocument();

    // Save button should be disabled while error present
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeDisabled();
  });

  it('allows changing status via the select', () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);
    const select = screen.getByDisplayValue('New') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Qualified' } });
    expect(select.value).toBe('Qualified');
  });

  it('calls onSave and shows success message on successful save', async () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);

    const saveBtn = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    // success message is set immediately after promise resolves (we don't test auto-hide)
    expect(screen.getByText(/Lead saved successfully!/)).toBeInTheDocument();
  });

  it('displays save error message when onSave rejects', async () => {
    onSave.mockRejectedValueOnce(new Error('Save failed'));
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);

    const saveBtn = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(screen.getByText(/Save failed/)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConvert with the current draft and email when Convert Lead is clicked', () => {
    render(<LeadDetailSlide lead={baseLead} onClose={onClose} onSave={onSave} onConvert={onConvert} />);
    const convertBtn = screen.getByRole('button', { name: /convert lead/i });
    fireEvent.click(convertBtn);

    // Note: the component calls setDraft({...draft, status: 'Converted'}) and then calls onConvert(draft, draft.email)
    // so onConvert receives the draft value at the time of click (the old draft reference).
    expect(onConvert).toHaveBeenCalledTimes(1);
    expect(onConvert).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), baseLead.email);
  });
});
