'use client'
import { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

export default function Home() {
	const [value, setValue] = useState(null)
	const [longLat, setLongLat] = useState(null)
	const [data, setData] = useState(null)

	async function getLongLat() {
		try {
			const place_id = value?.value?.place_id
			console.log(place_id)
			const geoUrl =
				'https://maps.googleapis.com/maps/api/geocode/json?place_id=' +
				place_id +
				'&key=' +
				process.env.NEXT_PUBLIC_GOOGLE_API_KEY
			console.log(geoUrl)
			const response = await fetch(geoUrl)
			const data = await response.json()
			console.log(data.results[0].geometry.location)

			const newLongLat = data.results[0].geometry.location
			setLongLat(newLongLat)

			await getSolarData(newLongLat)
		} catch (error) {
			console.log(error)
		}
	}

	async function getSolarData(longLat) {
		const solarUrl =
			'https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=' +
			longLat?.lat +
			'&location.longitude=' +
			longLat?.lng +
			'&requiredQuality=HIGH&key=' +
			process.env.NEXT_PUBLIC_GOOGLE_API_KEY
		const response = await fetch(solarUrl)
		const data = await response.json()
		console.log(data)
		setData(data.solarPotential)
	}

	return (
		<>
			<div className='flex flex-col mt-40 justify-center items-center'>
				<p className='text-4xl mb-24'>Enter address...</p>
				<div className='w-96 flex flex-col justify-center'>
					<GooglePlacesAutocomplete
						apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
						selectProps={{
							value,
							onChange: setValue,
						}}
					/>
					<input
						type='submit'
						className='border-black border-2 my-4 border-solid rounded-md hover:bg-slate-500 active:bg-slate-700 p-2'
						onClick={(e) => {
							e.preventDefault()
							getLongLat()
						}}
					/>
					{data ? (
						<>
							<p>{data.maxSunshineHoursPerYear} max sunshine hours per year</p>
							<p>{data.panelLifetimeYears} lifetime of panels</p>
						</>
					) : null}
				</div>
			</div>
			<iframe
				src='https://www.trytalked.com'
				width='50%'
				frameborder='1'
				className='w-full h-screen'
			></iframe>
		</>
	)
}
