import {
  FaEnvelope,
  FaFacebookF,
  FaFax,
  FaGithub,
  FaGoogle,
  FaHome,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <div>
      <footer className="bg-blue-200 text-center text-gray-600 lg:text-left">
        <div className="flex items-center justify-center border-b border-gray-300 p-6 lg:justify-between">
          <div className="mr-12 hidden lg:block">
            <span>Connect with us on social networks:</span>
          </div>
          <div className="flex justify-center">
            <a href="#" className="mr-6 text-gray-600">
              <FaFacebookF title="facebook" className="w-2.5" />
            </a>
            <a href="#" className="mr-6 text-gray-600">
              <FaTwitter title="twitter" className="w-4" />
            </a>
            <a href="#" className="mr-6 text-gray-600">
              <FaGoogle title="google" className="w-3.5" />
            </a>
            <a href="#" className="mr-6 text-gray-600">
              <FaInstagram title="instagram" className="w-3.5" />
            </a>
            <a href="#" className="mr-6 text-gray-600">
              <FaLinkedinIn title="linkedin" className="w-3.5" />
            </a>
            <a href="#" className="text-gray-600">
              <FaGithub title="github" className="w-4" />
            </a>
          </div>
        </div>
        <div className="mx-6 py-10 text-center md:text-left">
          <div className="grid-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="">
              <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                GrowPay
              </h6>
              <p>
                Send or receive Crypto to friends on their phone number or email Ids.
              </p>
            </div>
            <div className="">
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Links
              </h6>
              <p className="mb-4">
                <a href="#!" className="text-gray-600">
                  Home
                </a>
              </p>
              <p className="mb-4">
                <a href="#!" className="text-gray-600">
                  Pay to Phone
                </a>
              </p>
              <p className="mb-4">
                <a href="#!" className="text-gray-600">
                  Scan QR code
                </a>
              </p>
              <p>
                <a href="#!" className="text-gray-600">
                  My Profile
                </a>
              </p>
            </div>

            <div className="">
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Contact
              </h6>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                {/* <img
                  src="/icons/fas-home.svg"
                  alt="address"
                  className="mr-4 w-4 opacity-70"
                /> */}
                <FaHome title="address" className="mr-4 w-4" /> Bishnupur, WB
                722138, IN
              </p>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <FaEnvelope title="e-mail" className="mr-4 w-4" />{' '}
                tathagat.saha@gmail.com
              </p>
              <p className="mb-4 flex items-center justify-center md:justify-start">
                <FaPhone title="phone" className="mr-4 w-4" /> +91 963 5021 539
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <FaFax title="fax" className=" mr-4 w-4" /> +91 963 5021 539
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-300 p-6 text-center">
          <span>© 2022 Copyright: </span>
          <a className="text-gray-600 ">
            Developed by Tathagat Saha a.k.a Tatz
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
