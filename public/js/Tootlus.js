function alusta() {
  kuvaLipukesed();
}

function kuvaLipukesed() {
  riigid = [
    { kood: 'AT', aktiivne: false },
    { kood: 'BE', aktiivne: false },
    { kood: 'BG', aktiivne: false },
    { kood: 'CZ', aktiivne: false },
    { kood: 'CY', aktiivne: false },
    { kood: 'CD', aktiivne: true },
    { kood: 'DE', aktiivne: false },
    { kood: 'DK', aktiivne: false },
    { kood: 'EE', aktiivne: true },
    { kood: 'ES', aktiivne: false },
    { kood: 'FI', aktiivne: false },
    { kood: 'FR', aktiivne: false },
    { kood: 'GR', aktiivne: false },
    { kood: 'HR', aktiivne: false },
    { kood: 'HU', aktiivne: false },
    { kood: 'IE', aktiivne: false },
    { kood: 'IT', aktiivne: false },
    { kood: 'LT', aktiivne: false },
    { kood: 'LU', aktiivne: false },
    { kood: 'LV', aktiivne: false },
    { kood: 'MT', aktiivne: false },
    { kood: 'NL', aktiivne: false },
    { kood: 'NO', aktiivne: false },
    { kood: 'PL', aktiivne: false },
    { kood: 'PT', aktiivne: false },
    { kood: 'RO', aktiivne: false },
    { kood: 'SE', aktiivne: true },
    { kood: 'SI', aktiivne: false },
    { kood: 'SK', aktiivne: false },
    { kood: 'UK', aktiivne: false }
  ];
  var lipukesed = $('#lipukesed');
  riigid.forEach(r => {
    var ymbris = $('<div></div>')
      .addClass('lipukeseYmbris')
      .appendTo(lipukesed);
    var lipuke = $('<img></img>')
      .attr('src', 'img/' + r.kood + '.png')
      .attr('id', r.kood);
    if (r.aktiivne) {
      lipuke.addClass('aktiivne');
    } else {
      lipuke.addClass('mitteaktiivne');
    }
    lipuke.appendTo(ymbris);
  });
  // Sündmusekäsitlejate lisamine
  $('.aktiivne').click(function () {
    $('.lipukeseYmbris').removeClass('valitud');
    $(this).parent().addClass('valitud');
  });
}