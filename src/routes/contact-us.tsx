import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/contact-us')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState({ first_name: "", last_name: "",email: "",message: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
      text: string;
      type: "success" | "error";
    } | null>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isSubmitting) return;

		setIsSubmitting(true);
		setMessage(null);

		try {
			const response = await fetch("https://scrollsawbackend.onrender.com/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Failed to subscribe");
			}

			setMessage({
				text: "Thank you for subscribing to our newsletter!",
				type: "success",
			});
			setFormData({ first_name: "", last_name: "", message:"", email: "" }); // Reset form
		} catch (error) {
			console.error("Subscription error:", error);
			setMessage({
				text:
					error instanceof Error
						? error.message
						: "An error occurred while subscribing",
				type: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	}
  return <div className='container mx-auto py-24 px-4 lg:px-8'>
    <div className='flex flex-col lg:flex-row gap-8'>
      <div className="flex flex-col gap-9 w-full lg:w-[50%]">
        <h1 className='font-heading text-4xl lg:text-6xl'>Contact Us</h1>
        <p className='text-lg'>We would love to hear from whether you have questions, need support or learn more about us. We are here to help</p>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex-1'>
            <p className='font-bold'>Our Address</p>
            <p>Number 20B Peculiar Street, Off Oyebi Street Oriola Bus stop Ibafo, Ogun State Nigeria.</p>
          </div>
          <div className='flex-1'>
            <p className='font-bold'>Our Contact Info</p>
            <p>Number 20B Peculiar Street, Off Oyebi Street Oriola Bus stop Ibafo, Ogun State Nigeria.</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='bg-secondary-300 p-4 w-full lg:w-[50%] rounded-xl mt-8 lg:mt-0'>
        <h2 className='text-center mb-8 mt-4 font-heading text-4xl'>Get In touch</h2>
        <div className='flex flex-col gap-4 mb-8'>
          <label htmlFor=''>First Name</label>
          <input type='text' className='px-2 py-2 bg-white rounded-md' name='first_name' value={formData.first_name} onChange={handleChange}
					required />
        </div> 
        
        <div className='flex flex-col gap-4 mb-8'>
          <label htmlFor=''>Last Name</label>
          <input type='text' className='px-2 py-2 bg-white rounded-md' name='last_name' value={formData.last_name} onChange={handleChange}
					required />
        </div>
        
        <div className='flex flex-col gap-4 mb-8'>
          <label htmlFor=''>Email Address</label>
          <input className='px-2 py-2 bg-white rounded-md' name='email' type='email' value={formData.email} onChange={handleChange}
					required />
        </div>
        
        <div className='flex flex-col gap-4 mb-8'>
          <label htmlFor=''>Message</label>
          <textarea className='px-2 py-2 bg-white rounded-md' name='message' rows={10} value={formData.message} onChange={handleChange}
					required />
        </div>
        <button
				type="submit"
				className="w-full py-3 px-6 bg-secondary-400 hover:bg-secondary-500 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
			</button>
			{message && (
				<div
					className={`mt-4 p-3 rounded-md text-center ${
						message.type === "error"
							? "bg-red-100 text-red-700"
							: "bg-green-100 text-green-700"
					}`}
				>
					{message.text}
				</div>
			)}
      </form>
    </div> 
  </div>
}
