import React,{useContext} from 'react'
import { CaptainDataContext } from '../UserContext/CaptainContext'
const CaptainDetails = () => {
  const [captain]=useContext(CaptainDataContext);
  console.log("Captain data in CaptainHome:", captain);
   // Add a fallback for when captain data is not available
  if (!captain || !captain.fullname) {
    return <div>Loading captain details...</div>; // Show a loading message or placeholder
  }

  return (
    <div>
       <div onClick={()=>console.log(captain)} className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <img className="w-14 h-14 rounded-full" src="https://media.gettyimages.com/id/1752533660/video/happy-worker-and-face-of-business-asian-man-in-office-with-pride-confidence-and-ambition-in.jpg?s=640x640&k=20&c=FPPyepfVwPRmGudzLY-RkfVPiT1lPE_wBZ2WQZVGUOM=" alt=""></img>
            <div>
            <h4 className="text-lg font-medium">{captain.fullname.firstname} {captain.fullname.lastname}</h4>
            <p className='text-sm text-gray-600'>Your trip summary</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold">₹295.23</h4>
            <p className="text-sm text-gray-600">Earned</p>
          </div>
        </div>
        <div className="flex justify-center items-start gap-3 p-3 bg-gray-100 rounded-xl mt-6">
          <div className="text-center">
            <i className="text-3xl mb-2 ri-timer-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 ri-timer-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 ri-timer-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours online</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails