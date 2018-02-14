$(function() {
  $('body').on('click', '#submit', function() {
    const origin = $('#origin').val()
    const destination = $('#dest').val()
    const depDate = $('#dep-date').val()
    const returnDate = $('#return-date').val()
    const maxPrice = $('#price').val()

    window.location.replace(`/getFlightInfo/${origin}/${destination}/${depDate}/${returnDate}/${maxPrice}`)
  })
})
