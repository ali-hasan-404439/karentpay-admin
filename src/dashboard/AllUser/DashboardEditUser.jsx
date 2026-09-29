import { useEffect, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';
import Auth from '../../utils/Auth';
import { FaSpinner } from 'react-icons/fa6';
import InputField from '../../components/InputField';

function DashboardEditUser({ modalOpen, setModalOpen, setArray }) {
  const { ApiRequest } = Auth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userRoll, setUserRoll] = useState('');
  const [balance, setBalance] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      setName(modalOpen.name || '');
      setEmail(modalOpen.email || '');
      setPhone(modalOpen.phone || '');
      setBalance(modalOpen.balance || '');
      setUserRoll(modalOpen.role);
    }
  }, [modalOpen]);

  const validateInputs = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!userRoll) newErrors.userRoll = 'User role is required';
    if (balance && isNaN(balance)) newErrors.balance = 'Balance must be a number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccept = async () => {
    // if (!validateInputs()) return;

    const userData = {
      name,
      email,
      phone,
      user_roll: userRoll,
      balance,
      password,
    };

    setLoading(true);
    try {
      await ApiRequest({
        url: '/admin/user_update/' + modalOpen.id,
        formdata: userData,
      });

      toast.success('User updated successfully');
      setArray((prev) =>
        prev.map((item) =>
          item.id === modalOpen.id
            ? {
              ...item,
              name,
              email,
              phone,
              role: userRoll,
              balance,
            }
            : item
        )
      );
      setModalOpen('');
    } catch (error) {
      toast.error('Failed to update. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      {modalOpen && (
        <div
          id='default-modal'
          tabIndex='-1'
          aria-hidden='true'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-2xl p-4 mx-auto my-0'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700'>
              <form className='px-10 pt-10 space-y-5' noValidate>
                <InputField
                  label="Name"
                  value={name}
                  onChange={setName}
                  id="userName"
                  error={errors.name}
                />
                <InputField
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  id="Email"
                  error={errors.email}
                />
                <InputField
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  id="Phone"
                  error={errors.phone}
                />

                <div className='relative'>
                  <label
                    htmlFor='UserRoll'
                    className='mb-2 inline-block text-sm sm:text-base'
                  >
                    User Role
                  </label>
                  <select
                    onChange={(e) => setUserRoll(parseInt(e.target.value))}
                    id='UserRoll'
                    className={`bg-gray-50 border rounded-[4px] w-full p-3 ${errors.userRoll ? 'border-red-500' : 'border-gray-300'
                      } dark:bg-gray-700 dark:border-gray-600`}
                    value={userRoll}
                    required
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value={1}>Super Admin</option>
                    <option value={2}>Administrator</option>
                    <option value={3}>Moderator</option>
                    <option value={0}>User</option>
                  </select>
                  {errors.userRoll && (
                    <span className='text-red-500 text-sm'>{errors.userRoll}</span>
                  )}
                </div>


                <InputField
                  label="Balance"
                  value={balance}
                  onChange={setBalance}
                  id="Balance"
                  error={errors.balance}
                />

                <div className='relative'>
                  <label
                    htmlFor='Password'
                    className='mb-2 inline-block text-sm sm:text-base'
                  >
                    Password (Leave Empty if you don't want to change)
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type='text'
                    id='Password'
                    className='bg-gray-50 border border-gray-300 rounded-[4px] block w-full p-3 dark:bg-gray-700 dark:border-gray-600'
                    placeholder='Enter New Password'
                  />
                </div>
              </form>

              <div className='flex items-center gap-5 py-5 px-10 mt-5 border-t border-gray-200 dark:border-gray-600'>
                <button
                  onClick={handleAccept}
                  className='button_gradient'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Loading...
                    </>
                  ) : (
                    'Update Now'
                  )}
                </button>
                <button
                  onClick={() => setModalOpen('')}
                  className='button_cancel'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardEditUser;
