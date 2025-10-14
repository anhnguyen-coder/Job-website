import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />
      <h1>Hey, User <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
      <h2>Welcome to our website</h2>
      <p></p>
    </div>
  )
}

export default Header