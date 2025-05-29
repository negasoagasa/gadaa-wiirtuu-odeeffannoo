import React, { useState, useEffect } from 'react';
import { formatTime } from '../../utils/helpers';

const CallLogForm = ({ onSubmit, onContactChange, customerHistory, loading }) => {
  const [formData, setFormData] = useState({
    customerContact: '',
    item: '',
    category: '',
    description: '',
    status: 'new',
    escalatedTo: ''
  });

  const categories = {
    'Share Holders': [
      'Information on SMS received regarding shareholders concern',
      'When do we get certificate?',
      'When do you start share dividend',
      'Where and requirement to buy new or additional',
      'Share status request',
      'Share division contact number request',
      'Where and requirement to collect share certificate',
      'Where and requirement to settle remaining share payment',
      'Requirement to transfer share to other person',
      'I am not receiving message since I bought share complaint',
      'Message for generally is not received complaint',
      'Service number change request',
      'Can being share holder award for vacancy',
      'Can being shareholder award for credit',
      'New case'
    ],
    // ... other categories from your original code
  };

  useEffect(() => {
    if (formData.item) {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  }, [formData.item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'customerContact') {
      onContactChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await onSubmit({
      ...formData,
      isBackofficeCall: false
    });
    
    if (result.success) {
      setFormData({
        customerContact: '',
        item: '',
        category: '',
        description: '',
        status: 'new',
        escalatedTo: ''
      });
    }
  };

  return (
    <div className="call-log-form">
      <h2>Log New Call</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerContact">Customer Contact</label>
          <input
            type="text"
            id="customerContact"
            name="customerContact"
            value={formData.customerContact}
            onChange={handleChange}
            required
          />
        </div>
        
        {customerHistory && (
          <div className="customer-history visible">
            <div className="customer-history-header">
              <h4>Customer History</h4>
              <button 
                type="button" 
                className="close-history"
                onClick={() => onContactChange('')}
              >
                &times;
              </button>
            </div>
            <div className="customer-history-summary">
              <p><strong>Total Previous Calls:</strong> {customerHistory.calls.length}</p>
            </div>
            <div className="customer-history-list">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Issue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customerHistory.calls.map(call => (
                    <tr 
                      key={call._id}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          customerContact: customerHistory.contact
                        }));
                        onContactChange('');
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{formatTime(call.createdAt)}</td>
                      <td>{call.item} - {call.category}</td>
                      <td className={`status-${call.status}`}>{call.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="item">Item</label>
          <select
            id="item"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
          >
            <option value="">Select Item</option>
            {Object.keys(categories).map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Case Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={!formData.item}
          >
            <option value="">Select Category</option>
            {formData.item && categories[formData.item].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="new">New</option>
            <option value="escalated">Escalated</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
        
        {formData.status === 'escalated' && (
          <div className="form-group">
            <label htmlFor="escalatedTo">Escalate To</label>
            <select
              id="escalatedTo"
              name="escalatedTo"
              value={formData.escalatedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="backoffice">Back Office</option>
              <option value="finance">Finance</option>
              <option value="digital">Digital</option>
              <option value="shareholder">Shareholder</option>
            </select>
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging Call...' : 'Log Call'}
        </button>
      </form>
    </div>
  );
};

export default CallLogForm;