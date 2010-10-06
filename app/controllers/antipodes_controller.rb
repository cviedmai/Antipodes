class AntipodesController < ApplicationController
  require 'net/http'
  require 'rexml/document'
  require 'time'

  def view
  end

  def sunrise
    url = "http://api.yr.no/weatherapi/sunrise/1.0/?lat="+params[:lat]+";lon="+params[:lon]+";date="+Time.now.strftime("%Y-%m-%d")
    xml_data = Net::HTTP.get_response(URI.parse(url)).body
    doc = REXML::Document.new(xml_data)
    rise = Time.parse(doc.root.elements["time/location/sun"].attributes["rise"]).localtime.strftime("%I:%M:%S %p")
    set = Time.parse(doc.root.elements["time/location/sun"].attributes["set"]).localtime.strftime("%I:%M:%S %p")
    render :layout => false, :json => {:rise => rise, :set => set}.to_json
  end

end
