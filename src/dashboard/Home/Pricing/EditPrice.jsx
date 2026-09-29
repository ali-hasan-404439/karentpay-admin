import { useEffect, useState } from 'react';

import { LuCheck } from 'react-icons/lu';
import { MdOutlineCancel } from 'react-icons/md';

import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../components/InputField';

function EditPrice({
  editPriceModalOpen,
  setEditPriceModalOpen,
  setPricingData
}) {
  const [name, setName] = useState('');
  const [chargePercentage, setChargePercentage] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([{ name: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPriceModalOpen) {
      setName(editPriceModalOpen.name);
      setChargePercentage(editPriceModalOpen.charge_percentage);
      setDescription(editPriceModalOpen.description);
      setFeatures(editPriceModalOpen.features.length ? editPriceModalOpen.features : [{ name: '' }]);
    }
  }, [editPriceModalOpen]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!chargePercentage) {
      newErrors.chargePercentage = "Charge percentage is required.";
    } else if (isNaN(chargePercentage)) {
      newErrors.chargePercentage = "Charge percentage must be a number.";
    }
    if (!description) newErrors.description = "Description is required.";
    if (features.some((feature) => !feature.name)) {
      newErrors.features = "All features must have a name.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePriceData = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const data = {
      name,
      charge_percentage: chargePercentage,
      description,
      features
    };

    const token = Cookies.get('token');

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_HOST}/admin/pricing-items/${editPriceModalOpen.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setPricingData((pre) => {
        return pre.map((item) => {
          if (item.id === editPriceModalOpen.id) {
            return {
              ...item,
              name,
              charge_percentage: chargePercentage,
              description,
              features
            };
          }
          return item;
        })
      });
      toast.success('Price updated successfully!');
      // Clear all fields and reset features
      setName('');
      setChargePercentage('');
      setDescription('');
      setFeatures([{ name: '' }]);
    } catch (error) {
      toast.error('Failed to update price. Please try again.');
    }
    setEditPriceModalOpen(false);
    setLoading(false);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index].name = value;
    setFeatures(newFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, { name: '' }]);
  };

  const removeFeatureField = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  return (
    <>
      {editPriceModalOpen && (
        <div
          id='edit-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-5 pt-20 overflow-y-auto bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-3xl max-h-full m-5 text-black dark:text-white'>
            <div className='relative p-10 space-y-5 bg-white rounded-[4px] shadow dark:bg-gray-700'>
              <InputField
                label="Name"
                value={name}
                onChange={setName}
                id="name"
                error={errors.name}
                required={true}
              />
              <InputField
                label="Charge Percentage"
                value={chargePercentage}
                onChange={setChargePercentage}
                id="chargePercentage"
                error={errors.chargePercentage}
                required={true}
              />
              <InputField
                label="Description"
                value={description}
                onChange={setDescription}
                id="description"
                error={errors.description}
                required={true}
              />

              <div className='space-y-5'>
                <h1 className='block mb-2'>
                  Features <span className='required'>( Min 1 Required )</span>
                </h1>
                {features.map((feature, index) => (
                  <div key={index} className='relative flex items-center'>
                    <div className='flex-1'>
                      <label
                        htmlFor={`feature-${index}`}
                        className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
                      >
                        Feature {index + 1}
                      </label>
                      <input
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        type='text'
                        id={`feature-${index}`}
                        name={`feature-${index}`}
                        value={feature.name}
                        className={`border rounded-[4px] ${feature.name
                          ? 'border-green-500 dark:border-green-500 '
                          : 'border-gray-300'
                          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                        placeholder={`Feature ${index + 1}`}
                        required
                      />
                      {feature.name && (
                        <span className='absolute top-[3.2rem] right-6 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                          <LuCheck />
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFeatureField(index)}
                      type='button'
                      className='text-red-500  hover:text-red-700'
                    >
                      <MdOutlineCancel className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addFeatureField}
                type='button'
                className='mb-4 b border border-[#5C28D5] dark:border-[#5C28D5] hover:border-transparent hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white focus:outline-none rounded-md inline-flex items-center px-4 py-3 text-center transition text-sm'
              >
                Add Feature
              </button>

              <div className='flex items-center gap-2'>
                <button
                  onClick={updatePriceData}
                  className='button_gradient'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Loading...
                    </>
                  ) : (
                    <>Update Pricing</>
                  )}
                </button>
                <button
                  onClick={() => setEditPriceModalOpen(false)}
                  className='button_cancel'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditPrice;
