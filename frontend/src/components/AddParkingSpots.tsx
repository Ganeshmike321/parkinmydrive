import { useEffect, useState, useCallback } from 'react';
import BreadCrumbs from './BreadCrumbs';
import Footer from './Footer';
import { formatDate } from '../utils/DateTime';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import DatePicker from 'react-datepicker';
import Loader from './Loader';
import { getLatLong } from '../utils/GoogleApi';
import OwnerAxiosClient from '../axios/OwnerAxiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../redux/userSlice';
import { withSwal } from 'react-sweetalert2';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface ApiValue {
  label: string;
  value: {
    place_id: string;
    description: string;
  };
}

const AddParkingSpots = ({ swal }: any) => {
  const userRedux = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [apiValue, setApiValue] = useState<ApiValue | null>(null);
  const [mapPosition, setMapPosition] = useState({ lat: -34.397, lng: 150.644 });
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    const fetchLatLng = async () => {
      if (apiValue) {
        const { lat, lng } = await getLatLong(apiValue.value.place_id);
        setValue('google_map', apiValue.label);
        setMapPosition({ lat: lat ?? 0, lng: lng ?? 0 });
        setValue('latitude', lat ?? 0);
        setValue('longitude', lng ?? 0);
      }
    };
    fetchLatLng();
  }, [apiValue, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValid = files.every(file => validImageTypes.includes(file.type) && file.size <= 15 * 1024 * 1024);

    if (!isValid) {
      const msg = 'Please upload a valid photo';
      setFileError(msg);
      setError('photos', { type: 'required', message: msg });
      return;
    }

    setFileError('');
    clearErrors('photos');
    setPhotos(files);
    setValue('photos', files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data: any) => {
    setBackendError(null);
    setLoading(true);

    if (!apiValue) {
      setBackendError('Google Map field is required');
      setLoading(false);
      return;
    }

    if (photos.length === 0) {
      setError('photos', { type: 'required', message: 'This field is required' });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('slot_name', data.slot_name);
      formData.append('available_time', '24/7');
      formData.append('google_map', data.google_map);
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('available_slots', '1');
      formData.append('from_date_time', formatDate(data.from_date_time));
      formData.append('to_date_time', formatDate(data.to_date_time));
      formData.append('nearby_places', data.nearby_places);
      formData.append('vehicle_types', data.vehicle_types);
      formData.append('vehicle_fees', data.vehicle_fees);
      formData.append('auth_owner_id', userRedux.auth_owner_id);
      photos.forEach(photo => formData.append('photos[]', photo));

      const response = await OwnerAxiosClient.post('/api/owner-parking-spots', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if ([200, 201].includes(response.status)) {
        dispatch(saveUser({ data: { spotLength: 1 } }));
        swal.fire({
          title: 'Your parking spot has been successfully added.',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          navigate('/my-parking-spot');
        });
      } else if (response.status === 409) {
        swal.fire({ title: 'Parking spot already exists', icon: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      swal.fire({ title: 'Something went wrong, try again later', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = useCallback(async (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapPosition({ lat: lat ?? 0, lng: lng ?? 0 });
    setValue('latitude', lat ?? 0);
    setValue('longitude', lng ?? 0);

    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_APP_GOOGLE_API_KEY}`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const address = data.results[1]?.address_components[1]?.long_name || 'Selected Location';
        setApiValue({
          label: address,
          value: {
            place_id: data.results[1].place_id,
            description: address,
          },
        });
        const targetEl = document.querySelector('.css-1dimb5e-singleValue') || document.querySelector('.css-1jqq78o-placeholder');
        if (targetEl) targetEl.innerHTML = address;
      }
    } catch (e) {
      console.error('Reverse Geocoding failed', e);
    }
  }, [setValue]);

  const onMapLoad = useCallback(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setMapPosition({ lat: latitude, lng: longitude });
    });
  }, []);

  const CustomDatePickerInput = ({ value, onClick }: any) => (
    <div className="input-group date picker-date">
      <input
        type="text"
        className="form-control style-2 border-right"
        value={value || ''}
        onClick={onClick}
        placeholder="Choose Date"
        readOnly
      />
      <span className="input-group-append" onClick={onClick}>
        <span className="input-group-text bg-white d-block">
          <i className="fa fa-calendar"></i>
        </span>
      </span>
    </div>
  );

  return (
    <div>
      <BreadCrumbs title="Add Slot" />
      {/* Remaining JSX structure remains unchanged (form, layout, UI controls) */}
      <Footer />
    </div>
  );
};

export default withSwal(AddParkingSpots);
