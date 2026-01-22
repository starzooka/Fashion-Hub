import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore.js';
import '../styles/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
      setAddresses(user.addresses || []);
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // In real implementation, this would call an API
      const updatedUser = { ...user, ...formData };
      updateUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAddAddress = () => {
    if (addresses.length >= 3) {
      alert('You can only add up to 3 addresses');
      return;
    }
    setShowAddressForm(true);
    setEditingAddressIndex(null);
    setAddressForm({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    });
  };

  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(addresses[index]);
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!addressForm.label || !addressForm.street || !addressForm.city || 
        !addressForm.state || !addressForm.zipCode) {
      alert('Please fill all address fields');
      return;
    }

    let updatedAddresses;
    if (editingAddressIndex !== null) {
      updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = addressForm;
    } else {
      updatedAddresses = [...addresses, addressForm];
    }

    setAddresses(updatedAddresses);
    const updatedUser = { ...user, addresses: updatedAddresses };
    updateUser(updatedUser);
    
    setShowAddressForm(false);
    setAddressForm({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    });
    setEditingAddressIndex(null);
  };

  const handleDeleteAddress = (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(updatedAddresses);
      const updatedUser = { ...user, addresses: updatedAddresses };
      updateUser(updatedUser);
    }
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setAddressForm({
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    });
  };

  if (!user) {
    return <div className="container loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        {/* Profile Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="info-group">
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="disabled-input"
                title="Email cannot be changed"
              />
              <small className="help-text">Email cannot be changed</small>
            </div>

            <div className="info-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </div>

            <div className="info-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {isEditing && (
            <div className="action-buttons">
              <button onClick={handleSaveProfile} className="save-btn">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Saved Addresses</h2>
            {addresses.length < 3 && !showAddressForm && (
              <button onClick={handleAddAddress} className="add-btn">
                + Add Address
              </button>
            )}
          </div>

          {showAddressForm && (
            <div className="address-form">
              <h3>{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
              
              <div className="form-grid">
                <div className="info-group">
                  <label>Label *</label>
                  <select
                    name="label"
                    value={addressForm.label}
                    onChange={handleAddressChange}
                    required
                  >
                    <option value="">Select label</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="info-group full-width">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div className="info-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="info-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div className="info-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={addressForm.zipCode}
                    onChange={handleAddressChange}
                    placeholder="Enter zip code"
                    required
                  />
                </div>

                <div className="info-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={handleSaveAddress} className="save-btn">
                  {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                </button>
                <button onClick={handleCancelAddressForm} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="addresses-list">
            {addresses.length === 0 && !showAddressForm ? (
              <p className="no-addresses">No addresses saved yet. Add your first address!</p>
            ) : (
              addresses.map((address, index) => (
                <div key={index} className="address-card">
                  <div className="address-header">
                    <span className="address-label">{address.label}</span>
                    <div className="address-actions">
                      <button 
                        onClick={() => handleEditAddress(index)} 
                        className="icon-btn"
                        title="Edit address"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(index)} 
                        className="icon-btn delete"
                        title="Delete address"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="address-body">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {addresses.length >= 3 && !showAddressForm && (
            <p className="address-limit-msg">
              You've reached the maximum limit of 3 addresses
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
