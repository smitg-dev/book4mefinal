BookFromSpace

BookFromSpace is a space themed web project where you can explore different planets, moons and satellites and also book different kinds of space services. The idea was to make it feel more like an actual space travel system instead of just a normal booking website.

You can explore places like Mars, the Moon, Europa, the ISS, Titan and the JWST and see information about each one. There is also an interactive space background with stars, meteors and orbit paths running on canvas.

The main part of the project is the booking system. You can choose where you want to go, select a service and then go through the booking steps. Services include things like orbital hotel stays, surface expeditions, zero gravity training, spacewalks and satellite related tours.

The project currently has 6 main destinations. Mars has the Ares Prime Hub with things like rover expeditions around Olympus Mons and Valles Marineris. Luna Gateway is based around the Moon and includes the Shackleton crater habitat and an Apollo style buggy tour. Europa Cryo Terminal has the Jovian sky suites and underwater exploration using submersibles. The ISS Orbital Hotel focuses more on microgravity activities, spacewalks and astronaut training. Titan Saturn Outpost has things like atmospheric gliding and methane sea cruises, while the JWST Deep Relayer is based around observations from the L2 point.

There is also a canvas based orbital environment in the background. It has moving stars, small twinkling effects, shooting meteors and orbital paths. Clicking on a planet or satellite moves the view towards it and shows some information about it such as gravity, distance from Earth, surface temperature and atmosphere.

For the booking system, I made a multi step booking flow. First you select the destination and service. After that you choose a spaceport and launch vehicle. Then you enter the launch date and passenger details. There is also an addon section where you can add things like a custom spacesuit, centrifuge training, radiation shielding and quantum communication.

Once the booking is completed, the site creates a boarding pass for the mission. It includes things like the seat, gate, flight information and a QR/security hash. The boarding pass can also be printed.

Bookings are saved using localStorage, so they don't disappear when the page is refreshed. There is a reservation section where you can look at existing bookings, open their boarding passes or cancel a mission.

I also added some small sound effects using the Web Audio API. Things like button clicks, sci-fi tones and warp effects are generated directly in the browser instead of using external audio files.

You can open `index.html` directly in a browser, although using a local server works better.
